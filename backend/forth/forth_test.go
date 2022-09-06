package forth_test

import (
	"testing"

	"git.sr.ht/~theandrew168/sourdough/backend/forth"
)

func TestInterp(t *testing.T) {
	source := "25 10 * 50 + ."

	f := forth.New()
	err := f.Interpret(source)
	if err != nil {
		t.Fatal(err)
	}
}
