package todo

import (
    "fmt"
    "errors"
)

// Hello returns a greeting for the named person.
func Add(todo string) (string, error) {
    if todo == "" {
        return "", errors.New("empty todo")
    }
    // Return a greeting that embeds the name in a message.
    message := fmt.Sprintf("Added new todo: %v", todo)
    return message, nil
}