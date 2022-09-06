package forth_test

import (
	"errors"
	"testing"

	"git.sr.ht/~theandrew168/sourdough/backend/forth"
)

func TestStack(t *testing.T) {
	s := forth.NewStack(1)
	err := s.Push(42)
	if err != nil {
		t.Fatal(err)
	}

	err = s.Push(42)
	if !errors.Is(err, forth.ErrStackFull) {
		t.Errorf("got %v; want %v", nil, forth.ErrStackFull)
	}

	e, err := s.Pop()
	if err != nil {
		t.Fatal(err)
	}
	if e != 42 {
		t.Errorf("got %v; want %v", e, 42)
	}

	_, err = s.Pop()
	if !errors.Is(err, forth.ErrStackEmpty) {
		t.Errorf("got %v; want %v", nil, forth.ErrStackEmpty)
	}
}
