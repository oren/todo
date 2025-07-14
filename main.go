package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"strconv"
	"strings"
)

const todoFile = "todo.md"
const configFile = "config.json"

type Config struct {
	DisplayTags bool `json:"display_tags"`
}

var appConfig Config

func main() {
	loadConfig()

	if len(os.Args) < 2 {
		listTodos("") // List all todos if no arguments
		return
	}

	switch os.Args[1] {
	case "a":
		addTodoFromEditor()
	case "d":
		if len(os.Args) < 3 {
			fmt.Println("Usage: todo d <item number>")
			return
		}
		itemNumber, err := strconv.Atoi(os.Args[2])
		if err != nil {
			fmt.Println("Invalid item number:", os.Args[2])
			return
		}
		deleteTodo(itemNumber)
	case "e":
		if len(os.Args) < 3 {
			fmt.Println("Usage: todo e <item number>")
			return
		}
		itemNumber, err := strconv.Atoi(os.Args[2])
		if err != nil {
			fmt.Println("Invalid item number:", os.Args[2])
			return
		}
		editTodo(itemNumber)
	case "help":
		showHelp()
	default:
		// Check if the argument is a tag
		if strings.HasPrefix(os.Args[1], "@") {
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
	f, err := os.OpenFile(todoFile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		fmt.Println("Error opening todo file:", err)
		return
	}
	defer f.Close()

	parts := strings.Fields(todo)
	var contentToWrite string
	if len(parts) > 0 && strings.HasPrefix(parts[len(parts)-1], "@") {
		tag := parts[len(parts)-1]
		mainTodo := strings.Join(parts[:len(parts)-1], " ")
		contentToWrite = mainTodo + "\n" + tag + "\n---\n"
	} else {
		contentToWrite = todo + "\n---\n"
	}

	if _, err := f.WriteString(contentToWrite); err != nil {
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
		builder.WriteString("\n---\n")
	}

	return os.WriteFile(todoFile, []byte(builder.String()), 0644)
}

func showHelp() {
	fmt.Println("Usage: todo [command] [arguments]")
	fmt.Println("")
	fmt.Println("Commands:")
	fmt.Println("  (no arguments)  List all todos (showing only the first line).")
	fmt.Println("  <todo text>     Add a new todo item (e.g., todo buy milk). If the last word is a tag (starts with @), it will be added on a new line.")
	fmt.Println("  <@tag>          List todos with a specific tag (e.g., todo @groceries).")
	fmt.Println("  a               Open nvim to add a new multi-line todo.")
	fmt.Println("  d <number>      Delete a todo item by its number (e.g., todo d 2).")
	fmt.Println("  e <number>      Edit a todo item by its number in nvim (e.g., todo e 1).")
	fmt.Println("  help            Show this help message.")
}
