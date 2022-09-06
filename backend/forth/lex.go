package forth

import (
	"strings"
)

func Lex(source string) []string {
	return strings.Split(source, " ")
}
