package main

import (
	"bufio"
	"fmt"
	"os"

	"git.sr.ht/~theandrew168/sourdough/backend/forth"
)

func main() {
	os.Exit(run())
}

func run() int {
	scanner := bufio.NewScanner(os.Stdin)
	f := forth.New()

	fmt.Print("f> ")
	for scanner.Scan() {
		source := scanner.Text()

		err := f.Interpret(source)
		if err != nil {
			fmt.Println(err)
			return 1
		}

		fmt.Print("f> ")
	}

	return 0
}
