---
section: post
date: "2019-05-14"
title: "How I write a micro-service (part 2)"
description: "We are about to prepare a Golang project according to Clean and Hexagonal Architecture principles."
slug: how-i-write-a-micro-service-part-2
tags:
  - architecture
  - microservice
  - golang
---

# How I write a micro-service (part 2)

## Golang Template Project

We are about to prepare a Golang project according to Clean and Hexagonal Architecture principles.

> TL;DR - Code repository on Github - <https://github.com/Zenithar/go-spotigraph

### Domain

In order to manipulate concepts, we need to implements them. Let's use `Spotify agile terminology`.

- `User` is a system identity
  - `User` has an `id` 
  - `User` has a `principal` to describe user `private` identity (email, LDAP dn, etc.)
- `Squad` is a group of `User` working together on a product
  - `Squad` has an `id`
  - `Squad` has a `label`
  - `Squad` has a `Product Owner`, referenced by an `User:id`
- `Guild` is a group of `User` according to their affinities
  - `Guild` has an `id`
  - `Guild` has a `label`
  - `Guild` has `members`, a collection of `User:id`
- `Tribe` is a group of `Squad` working on common project
  - `Tribe` has an `id`
  - `Tribe` has a `label`
  - `Tribe` has `members`, a collection of `User:id`
- `Chapter` is a group of  `User` according to their skill-sets
  - `Chapter` has an `id`
  - `Chapter` has a `label`
  - `Chapter` has `members`, a collection of `User:id`
  - `Chapter` has a `Chapter Leader`, referenced by an `User:id`

### Core Services

> I assume from here that you know how to work with Golang - https://tour.golang.org

First, I create an `internal` package used to create the complete project, which will be executed in dedicated runnable artifacts.

```shell
$ mkdir spotigraph
$ go mod init go.zenithar.org/spotigraph
$ mkdir internal
```

> `internal` package will not be accessible from outside of the project package.

#### Helpers

Helpers should contain additional functions for `models`, such as:

- Password encoding, verification and policy upgrades (Algorithm deprecation)
- ID generation and validation
- Time function indirection for time drive tests

```shell
$ mkdir internal/helpers
```

##### Random ID Generation

For example, `id.go` should contain all logic used to generate and verify ID syntax.

```go
package helpers

import (
	"github.com/dchest/uniuri"
	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/go-ozzo/ozzo-validation/is"
)

// IDGeneratedLength defines the length of the id string
const IDGeneratedLength = 32

// IDGeneratorFunc returns a randomly generated string useable as identifier
var IDGeneratorFunc = func() string {
	return uniuri.NewLen(IDGeneratedLength)
}

// IDValidationRules describes identifier contract for syntaxic validation
var IDValidationRules = []validation.Rule{
	validation.Required,
	validation.Length(IDGeneratedLength, IDGeneratedLength),
	is.Alphanumeric,
}
```

> I like to use `ozzo-validation` because it's easy to create composable validation checks

##### Principal hashing

Another example with `principal` handling, you don't need to store it as plain text, think about privacy, database leaks, nobody is perfect ... So you could hash the `principal` before storing it. It's not the database role to hash the `principal`, it's part of your requirements to be privacy compliant.

```go
package helpers

import (
	"encoding/base64"

	"golang.org/x/crypto/blake2b"
)

var principalHashKey = []byte(`7EcP%Sm5=Wgoce5Sb"%[E.<&xG8t5soYU$CzdIMTgK@^4i(Zo|)LoDB'!g"R2]8$`)

// PrincipalHashFunc return the principal hashed using Blake2b keyed algorithm
var PrincipalHashFunc = func(principal string) string {
	// Prepare hasher
	hasher, err:= blake2b.New512(principalHashKey)
	if err!= nil {
		panic(err)
	}

	// Append principal
	_, err = hasher.Write([]byte(principal))
	if err!= nil {
		panic(err)
	}

	// Return base64 hash value of the principal hash
	return base64.RawStdEncoding.EncodeToString(hasher.Sum(nil))
}

// SetPrincipalHashKey used to set the key of hash function
func SetPrincipalHashKey(key []byte) {
	if len(key)!= 64 {
		panic("Principal hash key length must be 64bytes long.")
	}

	principalHashKey = key
}
```

> `principalHashKey` is hard-coded for default behavior, you must call exported function `SetPrincipalHashKey` to update the hash key.
>
> Don't use simple hash simple (without key) because in this case, the secret is only based on the hash algorithm you use!

##### Time indirection

In order to set time during tests, you could use `time.Now` function indirection by declaring an alias and use it everywhere.

```go
package helpers

// TimeFunc is used for time based tests
var TimeFunc = time.Now
```

> For more complex clock mocking, I advise you to consider [github.com/jonboulle/clockwork](github.com/jonboulle/clockwork).

##### Password

`Password` has to be carefully processed when you decide to store it. 

```go
package helpers

import (
	"context"
	"fmt"
	"sync"

	"go.zenithar.org/pkg/log"
	"go.zenithar.org/butcher"
	"go.zenithar.org/butcher/hasher"
	"github.com/trustelem/zxcvbn"
)

var (
	once sync.Once
    
	// butcher hasher instance
	butch *butcher.Butcher
    
	// PasswordPepper is added to password derivation during hash in order to
	// prevent salt/password bruteforce
	// Do not change this!! It will makes all stored password unrecoverable
	pepperSeed = []byte("TuxV%AqKB0|gxjEB!vc~]T8Hf[q|xgS('3S<IEnqOv:jF&F8}+pur)N@DHYulF#")
)

const (
	// PasswordQualityScoreThreshold is the password quality threshold
	PasswordQualityScoreThreshold = 3
)

// Initialize butcher hasher
func init() {
	once.Do(func() {
		var err error
		if butch, err = butcher.New(
			butcher.WithAlgorithm(hasher.ScryptBlake2b512),
			butcher.WithPepper(pepperSeed),
		); err!= nil {
			log.Bg().Fatal("Unable to initialize butcher hasher")
		}
	})
}

// SetPasswordPepperSeed used to set the peppering parameter for butcher
func SetPasswordPepperSeed(key []byte) {
	if len(key)!= 64 {
		panic("Password peppering seed length must be 64bytes long.")
	}

	pepperSeed = key
}

// PasswordHasherFunc is the function used for password hashing
var PasswordHasherFunc = func(password string) (string, error) {
    return butcher.Hash([]byte(password))
}

// PasswordVerifierFunc is the function used to check password hash besides the cleartext one
var PasswordVerifierFunc = func(hash string, cleartext string) (bool, error) {
    return butcher.Verify([]byte(hash), []byte(cleartext))
}

// CheckPasswordPolicyFunc is the function used to check password storage policy and
// call the assigner function to set the new encoded password using the updated 
// password storage policy, if applicable.
var CheckPasswordPolicyFunc = func(hash string, cleartext string, assigner func(string) error) (bool, error) {
    if butcher.NeedsUpgrade([]byte(hash)) {
		if err:= assigner(cleartext); err!= nil {
			return false, err
		}
	}
	return true, nil
}

// CheckPasswordQualityFunc is the function used to check password quality regarding security constraints
var CheckPasswordQualityFunc = func(cleartext string) error {
	quality:= zxcvbn.PasswordStrength(cleartext, nil)
	if quality.Score < PasswordQualityScoreThreshold {
		return fmt.Errorf("Password quality insufficient, try to complexify it (score: %d/%d)", quality.Score, PasswordQualityScoreThreshold)
	}
	return nil
}
```

> I use `zxvbn` as password strength evaluator ([github.com/trustelem/zxcvbn](github.com/trustelem/zxcvbn))

#### Models

```shell
$ mkdir internal/models
```

For example `user.go` is defined as follows:

```go
package models

import (
	"fmt"
    "time"

	"go.zenithar.org/spotigraph/internal/helpers"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/go-ozzo/ozzo-validation/is"
)

// User describes user attributes holder
type User struct {
    ID                 string
    Principal          string
    Created            time.Time
    PasswordModifiedAt time.Time
    Secret             string
}

// NewUser returns an user instance
func NewUser(principal string) *User {
    return &User{
        // Generate an identity from ID helper
		ID:        helpers.IDGeneratorFunc(),
        // Hash the given principal using helper
		Principal: helpers.PrincipalHashFunc(principal),
        // Set the creation date using the time function helper
        Created:   helpers.TimeFunc(),
	}
}
```

##### Password management

> Password is not persistence adapter specific, it's an entity attribute of the `User` model.

```go
// SetPassword updates the password hash of the given account
func (u *User) SetPassword(password string) (err error) {
	// Check password quality
	err = helpers.CheckPasswordQualityFunc(password)
	if err!= nil {
		return err
	}

	// Generate password hash
	u.Secret, err = helpers.PasswordHasherFunc(password)
	if err!= nil {
		return err
	}

	// Update last modified date
	u.PasswordModifiedAt = helpers.TimeFunc()

	// No error
	return nil
}

// VerifyPassword checks if given password matches the hash
func (u *User) VerifyPassword(password string) (bool, error) {
	// Validate password hash using constant time comparison
	valid, err:= helpers.PasswordVerifierFunc(u.Secret, password)
	if!valid || err!= nil {
		return false, err
	}

	// Check if password need upgrades
	return helpers.CheckPasswordPolicyFunc(u.PasswordHash, password, func(pwd string) error {
		return u.SetPassword(pwd)
	})
}
```

- `SetPassword` is used to update password hash using the password helpers, the given password is evaluated according to password complexity policy, hashed using `scrypt-blake2b-512` algorithm.
- `VerifyPassword` is used to verify the given clear-text password with the local encoded one. If the password encoding strategy changed since the password storage, the password is verified using the last password encoding strategy, then updated to latest one if password match. If the encoded password is modified, `User:passwordHash` will be updated using the callback.

> The password encoding update strategy is mandatory if you want to be able to update the password encoding policy without asking everyone to change their password.

##### Validation

For `User` validation, let's implement a `Validate() error` function using `ozzo-validation`.

```go
// Validate entity contraints
func (u *User) Validate() error {
	return validation.ValidateStruct(u,
        // User must have a valid id
        validation.Field(&u.ID, helpers.IDValidationRules...),
    	// User must have a principal with valid printable ASCII characters as value
        validation.Field(&u.Principal, validation.Required, is.PrintableASCII),
	)
}
```

> This method will be called from persistence adapters on creation, and update requests

By adding logic in models, you must add unit tests to check for specification compliance. 

```go
package models_test

import (
	"testing"

	. "github.com/onsi/gomega"

	"go.zenithar.org/spotigraph/internal/models"
)

func TestUserValidation(t *testing.T) {
	g:= NewGomegaWithT(t)

	for _, f := range []struct {
		name      string
		expectErr bool
	}{
		{"toto@foo.com", false},
	} {
		obj:= models.NewUser(f.name)
		g.Expect(obj).ToNot(BeNil(), "Entity should not be nil")

		if err := obj.Validate(); err!= nil {
			if!f.expectErr {
				t.Errorf("Validation error should not be raised, %v raised", err)
			}
		} else {
			if f.expectErr {
				t.Error("Validation error should be raised")
			}
		}
	}
}
```

> Note the table driven test pattern very useful to decorelate test data from test cases (https://dave.cheney.net/2019/05/07/prefer-table-driven-tests).

## References

- [Github Spotigraph](https://github.com/Zenithar/go-spotigraph)
- [Mocking time with Go](https://medium.com/agrea-technogies/mocking-time-with-go-a89e66553e79)