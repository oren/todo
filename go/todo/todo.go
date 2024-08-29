package todo

import "fmt"

// Hello returns a greeting for the named person.
func Add(todo string) string {
    // Return a greeting that embeds the name in a message.
    message := fmt.Sprintf("Added new todo: %v", todo)
    return message
}
