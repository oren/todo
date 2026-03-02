package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
)

var todoDir = filepath.Join(os.Getenv("HOME"), ".config", "todo")
var todoFile = filepath.Join(todoDir, "todo")
var configFile = filepath.Join(todoDir, "config.json")
var lastViewedFile = filepath.Join(todoDir, "last_viewed")

type Config struct {
	DisplayTags bool `json:"display_tags"`
}

var appConfig Config

func main() {
	os.MkdirAll(todoDir, 0755)
	loadConfig()

	if len(os.Args) < 2 {
		listTodos("") // List all todos if no arguments
		return
	}

	switch os.Args[1] {
	case "a":
		addTodoFromEditor()
	case "d":
		deleteLastViewed()
	case "o":
		openTodoFile()
	case "help":
		showHelp()
	default:
		// Check if the argument is a number (view, delete, or edit)
		if itemNumber, err := strconv.Atoi(os.Args[1]); err == nil {
			if len(os.Args) == 2 {
				viewTodo(itemNumber)
			} else {
				switch os.Args[2] {
				case "d":
					deleteTodo(itemNumber)
				case "e":
					editTodo(itemNumber)
				default:
					fmt.Println("Unknown action:", os.Args[2])
				}
			}
		} else if strings.HasPrefix(os.Args[1], "@") {
			listTodos(os.Args[1])
		} else {
			addTodo(strings.Join(os.Args[1:], " "))
		}
	}
}

func loadConfig() {
	data, err := os.ReadFile(configFile)
	if err != nil {
		if os.IsNotExist(err) {
			// Create default config if it doesn't exist
			appConfig = Config{DisplayTags: true}
			saveConfig()
			return
		}
		fmt.Println("Error reading config file:", err)
		return
	}

	if err := json.Unmarshal(data, &appConfig); err != nil {
		fmt.Println("Error unmarshaling config:", err)
	}
}

func saveConfig() {
	data, err := json.MarshalIndent(appConfig, "", "  ")
	if err != nil {
		fmt.Println("Error marshaling config:", err)
		return
	}

	if err := os.WriteFile(configFile, data, 0644); err != nil {
		fmt.Println("Error writing config file:", err)
	}
}

func addTodo(todo string) {
	todos, err := readTodos()
	if err != nil {
		fmt.Println("Error reading todo file:", err)
		return
	}

	parts := strings.Fields(todo)
	var newTodo string
	if len(parts) > 0 && strings.HasPrefix(parts[len(parts)-1], "@") {
		tag := parts[len(parts)-1]
		mainTodo := strings.Join(parts[:len(parts)-1], " ")
		newTodo = mainTodo + "\n" + tag
	} else {
		newTodo = todo
	}

	todos = append(todos, newTodo)

	if err := writeTodos(todos); err != nil {
		fmt.Println("Error writing to todo file:", err)
	}
}

func addTodoFromEditor() {
	editor := "nvim"

	tempFile, err := os.CreateTemp("", "todo-*.md")
	if err != nil {
		fmt.Println("Error creating temporary file:", err)
		return
	}
	defer os.Remove(tempFile.Name())

	cmd := exec.Command(editor, tempFile.Name())
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		fmt.Println("Error opening editor:", err)
		return
	}

	newTodo, err := os.ReadFile(tempFile.Name())
	if err != nil {
		fmt.Println("Error reading temporary file:", err)
		return
	}

	addTodo(strings.TrimSpace(string(newTodo)))
}

func editTodo(itemNumber int) {
	todos, err := readTodos()
	if err != nil {
		fmt.Println("Error reading todos:", err)
		return
	}

	if itemNumber < 1 || itemNumber > len(todos) {
		fmt.Println("Invalid item number:", itemNumber)
		return
	}

	editor := "nvim"
	tempFile, err := os.CreateTemp("", "todo-*.md")
	if err != nil {
		fmt.Println("Error creating temporary file:", err)
		return
	}
	defer os.Remove(tempFile.Name())

	if _, err := tempFile.WriteString(todos[itemNumber-1]); err != nil {
		fmt.Println("Error writing to temporary file:", err)
		return	}

	cmd := exec.Command(editor, tempFile.Name())
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		fmt.Println("Error opening editor:", err)
		return
	}

	updatedTodo, err := os.ReadFile(tempFile.Name())
	if err != nil {
		fmt.Println("Error reading temporary file:", err)
		return
	}

	todos[itemNumber-1] = strings.TrimSpace(string(updatedTodo))

	if err := writeTodos(todos); err != nil {
		fmt.Println("Error writing todos:", err)
	}
}

func listTodos(filterTag string) {
	todos, err := readTodos()
	if err != nil {
		fmt.Println("Error reading todos:", err)
		return
	}

	if len(todos) == 0 {
		fmt.Println("No todos yet!")
		return	}

	filteredCount := 0
	for _, todo := range todos {
		lines := strings.Split(todo, "\n")
		mainTodo := lines[0]
		tag := ""
		if len(lines) > 1 && strings.HasPrefix(lines[1], "@") {
			tag = lines[1]
		}

		if filterTag != "" && tag != filterTag {
			continue // Skip if filtering by tag and it doesn't match
		}

		filteredCount++
		if appConfig.DisplayTags && tag != "" {
			fmt.Printf("%d. %s %s\n", filteredCount, mainTodo, tag)
		} else {
			fmt.Printf("%d. %s\n", filteredCount, mainTodo)
		}
	}

	if filteredCount == 0 && filterTag != "" {
		fmt.Printf("No todos found with tag '%s'\n", filterTag)
	}
}

func viewTodo(itemNumber int) {
	todos, err := readTodos()
	if err != nil {
		fmt.Println("Error reading todos:", err)
		return
	}

	if itemNumber < 1 || itemNumber > len(todos) {
		fmt.Println("Invalid item number:", itemNumber)
		return
	}

	fmt.Println(todos[itemNumber-1])
	saveLastViewed(itemNumber)
}

func deleteTodo(itemNumber int) {
	todos, err := readTodos()
	if err != nil {
		fmt.Println("Error reading todos:", err)
		return
	}

	if itemNumber < 1 || itemNumber > len(todos) {
		fmt.Println("Invalid item number:", itemNumber)
		return
	}

	// Remove the item at the given index (itemNumber - 1)
	todos = append(todos[:itemNumber-1], todos[itemNumber:]...)

	if err := writeTodos(todos); err != nil {
		fmt.Println("Error writing todos:", err)
	}
}

func readTodos() ([]string, error) {
	data, err := os.ReadFile(todoFile)
	if err != nil {
		if os.IsNotExist(err) {
			return []string{}, nil
		}
		return nil, err
	}

	todos := strings.Split(string(data), "---")
	var filteredTodos []string
	for _, todo := range todos {
		trimmedTodo := strings.TrimSpace(todo)
		if trimmedTodo != "" {
			filteredTodos = append(filteredTodos, trimmedTodo)
		}
	}
	return filteredTodos, nil
}

func writeTodos(todos []string) error {
	var builder strings.Builder
	for _, todo := range todos {
		builder.WriteString(todo)
		builder.WriteString("\n\n---\n\n")
	}

	return os.WriteFile(todoFile, []byte(builder.String()), 0644)
}

func todoFileHash() string {
	data, err := os.ReadFile(todoFile)
	if err != nil {
		return ""
	}
	h := sha256.Sum256(data)
	return hex.EncodeToString(h[:])
}

func saveLastViewed(itemNumber int) {
	content := strconv.Itoa(itemNumber) + "\n" + todoFileHash()
	os.WriteFile(lastViewedFile, []byte(content), 0644)
}

func deleteLastViewed() {
	data, err := os.ReadFile(lastViewedFile)
	if err != nil {
		return
	}
	parts := strings.SplitN(strings.TrimSpace(string(data)), "\n", 2)
	if len(parts) != 2 {
		return
	}
	if parts[1] != todoFileHash() {
		return
	}
	itemNumber, err := strconv.Atoi(parts[0])
	if err != nil {
		return
	}
	deleteTodo(itemNumber)
	os.Remove(lastViewedFile)
}

func openTodoFile() {
	cmd := exec.Command("nvim", todoFile)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		fmt.Println("Error opening todo file:", err)
	}
}

func showHelp() {
	fmt.Println("Usage: todo [command] [arguments]")
	fmt.Println("")
	fmt.Println("Commands:")
	fmt.Println("  (no arguments)  List all todos (showing only the first line).")
	fmt.Println("  <todo text>     Add a new todo item (e.g., todo buy milk). If the last word is a tag (starts with @), it will be added on a new line.")
	fmt.Println("  <@tag>          List todos with a specific tag (e.g., todo @groceries).")
	fmt.Println("  a               Open nvim to add a new multi-line todo.")
	fmt.Println("  d               Delete the last viewed todo.")
	fmt.Println("  o               Open the todo file in nvim.")
	fmt.Println("  <number>        View a specific todo item (e.g., todo 1).")
	fmt.Println("  <number> d      Delete a todo item by its number (e.g., todo 2 d).")
	fmt.Println("  <number> e      Edit a todo item by its number in nvim (e.g., todo 1 e).")
	fmt.Println("  help            Show this help message.")
}
