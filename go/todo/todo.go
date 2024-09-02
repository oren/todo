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
