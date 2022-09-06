package forth_test

import (
	"strings"
	"testing"

	"git.sr.ht/~theandrew168/sourdough/backend/forth"
)

func TestInterp(t *testing.T) {
	words := strings.Split("25 10 * 50 + .", " ")
	err := forth.Interpret(words)
	if err != nil {
		t.Fatal(err)
	}
}
