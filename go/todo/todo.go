package todo

import (
    "fmt"
    "errors"
    "os"
)

// Hello returns a greeting for the named person.
func Add(todo string) (string, error) {
    if todo == "" {
        return "", errors.New("empty todo")
    }

    data := []byte("hello")
	err := os.WriteFile("todo.md", data, 0644)

	if err != nil {
		panic(err)
	}

    // Return a greeting that embeds the name in a message.
    message := fmt.Sprintf("Added new todo: %v", todo)
    return message, nil
}

// func addLinetoFile(filename String, todo String) {
// 	// Read the entire file content
// 	content, err := ioutil.ReadFile(filename)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
//
// 	// The new line to be added at the beginning
// 	newLine := todo
//
// 	// Combine the new line with the existing content
// 	newContent := append([]byte(newLine), content...)
//
// 	// Write the combined content back to the file
// 	err = ioutil.WriteFile(filename, newContent, 0644)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// }
