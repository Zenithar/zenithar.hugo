---
section: post
date: "2019-05-14"
title: "How I write a micro-service (part 3)"
description: "Persistence adapter implementations"
slug: how-i-write-a-micro-service-part-3
tags:
  - architecture
  - microservice
  - golang
---

# How I write a micro-service (part 3)

`Repositories` as Hexagonal architecture defines this component is a `persisence adapter`. It's a technical implementation of a `models` provider. It could be:

- A local provider: database, file;
- A remote provider: another micro-service.

I'm used to splitting repository implementations in a dedicated package according to technical backend used.

```shell
$ mkdir internal/repositories
$ touch internal/repositories/api.go
$ mkdir internal/repositories/pkg
$ mkdir internal/repositories/pkg/postgresql
$ mkdir internal/repositories/pkg/mongodb
```

The filesystem should be like it follows:

```shell
 + internal
   + helpers
     - id.go
	 - password.go
	 - time.go
   + models
     - user.go
   + repositories
     - api.go
     + pkg
       + postgresql
       + mongodb
```

## Adapter Contract 

But before starting to implements the `persistence adapter`, and in order to comply with the `dependency loose coupling` of `The Clean Architecture`, we have to declare the adapter interface first. So that all implementations must be compliant with.

For example `api.go`, must contain only `repository contract`.

```go
package repositories

import (
	"context"

	"go.zenithar.org/pkg/db"
	"go.zenithar.org/spotigraph/internal/models"
)

// UserSearchFilter represents user entity collection search criteria
type UserSearchFilter struct {
	UserID    string
	// Principal hash value must be used
	Principal string
}

// User describes user repository contract
type User interface {
	// Create a user
	Create(ctx context.Context, entity *models.User) error
	// Retrieve an user
	Get(ctx context.Context, id string) (*models.User, error)
	// Update selectively an user instance
	Update(ctx context.Context, entity *models.User) error
	// Delete an user instance
	Delete(ctx context.Context, id string) error
	// Search for user entities using filter, pagination and sorts
	Search(ctx context.Context, filter *UserSearchFilter, p *db.Pagination, s *db.SortParameters) ([]*models.User, int, error)
	// Retrieve an user by principal hash value
	FindByPrincipal(ctx context.Context, principal string) (*models.User, error)
}
```

> Don't forget to pass `context.Context` as far as possible in your calls, in case of request cancellation bound to HTTP request.
> When the caller cancel the HTTP request, the SQL request must be cancelled too, etc.

Our repository implementations must handle entities so that `principal` has to be hashed before using it (for example `FindByPrincipal`)

## Unit Tests

For testing, I've added this go compiler generate step in `api.go`, to build `User` mocks from interface type definition.

```go
//go:generate mockgen -destination test/mock/user.gen.go -package mock go.zenithar.org/spotigraph/internal/repositories User
```

> Repository mocks will be used by service unit tests.

## Integration Tests

These tests are executed using a real backend. 

For example, the `User` integration test generator creates a full test that create, read, update, delete `User` using the `persistence adapter` implementation.

> `Integration tests` will be evicted from default test target using the build tag `integration`

```go
//+build integration

package specs

import (
	"context"
	"testing"

	"github.com/google/go-cmp/cmp"
	. "github.com/onsi/gomega"

	"go.zenithar.org/pkg/db"
	"go.zenithar.org/spotigraph/internal/models"
	"go.zenithar.org/spotigraph/internal/repositories"
)

// User returns user repositories full test scenario builder
func User(underTest repositories.User) func(*testing.T) {
	return func(t *testing.T) {
		// Flag this test that could be run in parallel
		t.Parallel()

		// Prepare gomega matcher
		g:= NewGomegaWithT(t)

		// Stub context
		ctx:= context.Background()

		// Prepare a new entity
		created:= models.NewUser("toto@foo.com")
		g.Expect(created).ToNot(BeNil(), "Newly created entity should not be nil")

		// Create the entity using repository
		err:= underTest.Create(ctx, created)
		g.Expect(err).To(BeNil(), "Error creation should be nil")

		// -------------------------------------------------------------------------

		// Retrieve by id from repository
		saved, err:= underTest.Get(ctx, created.ID)
		g.Expect(err).To(BeNil(), "Retrieval error should be nil")
		g.Expect(saved).ToNot(BeNil(), "Saved entity should not be nil")

		// Compare objects
		g.Expect(cmp.Equal(created, saved)).To(BeTrue(), "Saved and Created should be equals")

		// Retrieve by non-existent id
		nonExistent, err:= underTest.Get(ctx, "non-existent-id")
		g.Expect(err).ToNot(BeNil(), "Error should be raised on non-existent entity")
		g.Expect(err).To(Equal(db.ErrNoResult), "Error ErrNoResult should be raised")
		g.Expect(nonExistent).To(BeNil(), "Non-existent entity should be nil")

		// Retrieve by principal
		savedPrincipal, err:= underTest.FindByPrincipal(ctx, created.Principal)
		g.Expect(err).To(BeNil(), "Retrieval error should be nil")
		g.Expect(savedPrincipal).ToNot(BeNil(), "Saved entity should not be nil")

		// Compare objects
		g.Expect(cmp.Equal(created, savedPrincipal)).To(BeTrue(), "SavedPrincipal and Created should be equals")

		// -------------------------------------------------------------------------

		// Update an entity
		saved, err = underTest.Get(ctx, created.ID)
		g.Expect(err).To(BeNil(), "Retrieval error should be nil")
		g.Expect(saved).ToNot(BeNil(), "Saved entity should not be nil")

		// Update properties

		// Update with repository
		err = underTest.Update(ctx, saved)
		g.Expect(err).To(BeNil(), "Update error should be nil")

		// Retrieve from repository to check updated properties
		updated, err:= underTest.Get(ctx, created.ID)
		g.Expect(err).To(BeNil(), "Retrieval error should be nil")
		g.Expect(updated).ToNot(BeNil(), "Saved entity should not be nil")

		// Compare objects
		g.Expect(cmp.Equal(created, updated)).To(BeTrue(), "Saved and Updated should be equals")

		// -------------------------------------------------------------------------

		// Remove an entity
		err = underTest.Delete(ctx, created.ID)
		g.Expect(err).To(BeNil(), "Removal error should be nil")

		// Retrieve from repository to check deletion
		deleted, err:= underTest.Get(ctx, created.ID)
		g.Expect(err).ToNot(BeNil(), "Deletion error should not be nil")
		g.Expect(err).To(Equal(db.ErrNoResult), "Error ErrNoResult should be raised")
		g.Expect(deleted).To(BeNil(), "Deleted entity should be nil")

		// Remove a non-existent entity
		err = underTest.Delete(ctx, "non-existent-id")
		g.Expect(err).ToNot(BeNil(), "Removal error should not be nil")
		g.Expect(err).To(Equal(db.ErrNoModification), "Error ErrNoModification should be raised")
	}
}
```

# Persistence implementations

During many years, I have enhanced, rebuild approximatively 30 times my own framework.
All implementation are using it as foundation, you are free to pickup what you need form it.

> [go.zenithar.org/pkg](https://github.com/Zenithar/go-pkg)

It's [multi-sub-module Golang repository](https://github.com/golang/go/wiki/Modules), so you don't need to pull the entire repository, everything is 
splitted and versionned independently in a minimal package.

## PostgreSQL

First of all, we need to prepare the PostgreSQL package.

```shell
$ mkdir internal/repositories/pkg/postgresql/migrations
$ touch internal/repositories/pkg/postgresql/setup.go
$ touch internal/repositories/pkg/postgresql/table_user.go
```

### Schema migrations handling

I'm use to put all the database specific preparation setup in a file nammed `setup.go`.
This is used to declares all table name constants, but also database migrations that will be embedded in the final
atifact using `packr`.

> Why `packr` ? Heu because ... not `go-bin-data` ... ?

```go
package postgresql

import (
	"github.com/gobuffalo/packr"
	"github.com/google/wire"
	"github.com/jmoiron/sqlx"
	"golang.org/x/xerrors"

	// Load postgresql drivers
	_ "github.com/jackc/pgx"
	_ "github.com/jackc/pgx/pgtype"
	_ "github.com/jackc/pgx/stdlib"
	_ "github.com/lib/pq"

	migrate "github.com/rubenv/sql-migrate"
	db "go.zenithar.org/pkg/db/adapter/postgresql"
)

// ----------------------------------------------------------

var (
	// UserTableName represents users collection name
	UserTableName = "users"
)

// ----------------------------------------------------------

//go:generate packr

// migrations contains all schema migrations
var migrations = &migrate.PackrMigrationSource{
	Box: packr.NewBox("./migrations"),
}

// CreateSchemas create or updates the current database schema
func CreateSchemas(conn *sqlx.DB) (int, error) {
	// Migrate schema
	migrate.SetTable("schema_migration")

	// Run the schema migration from embedded resource
	n, err := migrate.Exec(conn.DB, conn.DriverName(), migrations, migrate.Up)
	if err != nil {
		return 0, xerrors.Errorf("postgresql: could not migrate sql schema, applied %d migrations :%w", n, err)
	}

	return n, nil
}
```

And database schema migrations like it follows :

```sql
-- +migrate Up
CREATE TABLE IF NOT EXISTS chapters (
    id          VARCHAR(32) NOT NULL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    meta        JSON        NOT NULL,
    leader_id   VARCHAR(32) NOT NULL,
    member_ids  JSON        NOT NULL
);

-- +migrate Down
DROP TABLE chapters;
```

There are 2 "annotations" for migration direction, it is used by your migration tools to apply the correct
SQL script according the upgrade or downgrade process.

> Meticulous people should have noticed that I load 2 different PostgreSQL drivers (`pq`, and `pgx`).

The rule of internal database migrations says :

* Use automigration for integration tests only
* Never try to apply automatically migrations on service starts, in case of a cluster there will have code running not 
  compatible with the updated persistence schema
* Know what you are doing

### User Persistence Adapter

For example as `User` persistence adapter for `PostgreSQL` in `table_user.go` in `internal/repositories/pkg/postgresql`

```go
package postgresql

import (
	"context"
	"strings"

	"go.zenithar.org/pkg/db"
	"go.zenithar.org/pkg/db/adapter/postgresql"
	"go.zenithar.org/spotigraph/internal/models"
	"go.zenithar.org/spotigraph/internal/repositories"
    
	sq "github.com/Masterminds/squirrel"
	"github.com/jmoiron/sqlx"
	"golang.org/x/xerrors"
)

type pgUserRepository struct {
	adapter *postgresql.Default
}

// NewUserRepository returns a Postgresql user management repository instance
func NewUserRepository(session *sqlx.DB) repositories.User {
	// Default columns to retrieve
	defaultColumns := []string{"user_id", "principal", "secret", "creation_date"}

	// Sortable columns for criteria
	sortableColumns := []string{"user_id", "principal", "creation_date"}

	// Initialize repository
	return &pgUserRepository{
		adapter: postgresql.NewCRUDTable(session, "", UserTableName, defaultColumns, sortableColumns),
	}
}

// -----------------------------------------------------------------------------

func (r *pgUserRepository) Create(ctx context.Context, entity *models.User) error {
	// Validate entity first
	if err := entity.Validate(); err != nil {
		return xerrors.Errorf("postgresql: unable to validate entity, creation aborted : %w", err)
	}

	return r.adapter.Create(ctx, entity)
}

func (r *pgUserRepository) Get(ctx context.Context, realmID, id string) (*models.User, error) {
	var entity models.User

	// Delegate to my own postgresql adpater
	if err := r.adapter.WhereAndFetchOne(ctx, map[string]interface{}{
		"user_id":  id,
	}, &entity); err != nil {
		return nil, xerrors.Errorf("postgresql: unable to query database: %w", err)
	}

	return &entity, nil
}

func (r *pgUserRepository) Update(ctx context.Context, entity *models.User) error {
	// Validate entity first
	if err := entity.Validate(); err != nil {
		return xerrors.Errorf("postgresql: unable to validate entity, update aborted : %w", err)
	}

	// Only update allowed attributes, never, never, did I say never ?
	// always the full object.
	if err := r.adapter.Update(ctx, map[string]interface{}{
		"secret": entity.Secret,
	}, map[string]interface{}{
		"user_id":  entity.ID,
	}); err != nil {
		return xerrors.Errorf("postgresql: unable to update entity: %w", err)
	}

	// No error
	return nil
}

func (r *pgUserRepository) Delete(ctx context.Context, realmID, id string) error {

	// Delegate to adapter
	if err := r.adapter.RemoveOne(ctx, map[string]interface{}{
		"user_id":  id,
	}); err != nil {
		return xerrors.Errorf("postgresql: unable to remove entity: %w", err)
	}

	// No error
	return nil
}

func (r *pgUserRepository) Search(ctx context.Context, filter *repositories.UserSearchFilter, pagination *db.Pagination, sortParams *db.SortParameters) ([]*models.User, int, error) {
	var results []*models.User

	// Delegate to adapter
	count, err := r.adapter.Search(ctx, r.buildFilter(filter), pagination, sortParams, &results)
	if err != nil {
		return nil, count, xerrors.Errorf("postgresql: unable to list entities: %w", err)
	}

	// Standardize the error on no result to be coherent with all implementations
	if len(results) == 0 {
		return results, count, db.ErrNoResult
	}

	// Return results and total count
	return results, count, nil
}

func (r *pgUserRepository) FindByPrincipal(ctx context.Context, realmID string, principal string) (*models.User, error) {
	var entity models.User

	// Delegate to adapter
	if err := r.adapter.WhereAndFetchOne(ctx, map[string]interface{}{
		"principal": principal,
	}, &entity); err != nil {
		return nil, xerrors.Errorf("postgresql: unable to retrieve entity: %w", err)
	}

	return &entity, nil
}

// -----------------------------------------------------------------------------

func (r *pgUserRepository) buildFilter(filter *repositories.UserSearchFilter) interface{} {
	if filter != nil {
		clauses := sq.Eq{
			"1": "1",
		}

		if len(strings.TrimSpace(filter.UserID)) > 0 {
			clauses["user_id"] = filter.UserID
		}
		if len(strings.TrimSpace(filter.Principal)) > 0 {
			clauses["principal"] = filter.Principal
		}

		return clauses
	}

	return nil
}
```

### Squad Persistence Adapter

If the `model` can't fit directly in the persistence adapter you have to translate it  as needed

With given table schema :

```sql
-- +migrate Up
CREATE TABLE IF NOT EXISTS squads (
    id                  VARCHAR(32) NOT NULL PRIMARY KEY,
    name                VARCHAR(50) NOT NULL,
    meta                JSON        NOT NULL,
    product_owner_id    VARCHAR(32) NOT NULL,
    member_ids          JSON        NOT NULL
);

-- +migrate Down
DROP TABLE squads;
```

>  In this case, I choose to use `JSON` column type to handle `Squad:members` association and `Squad:metadata`. So I had to translate `member_ids` array as a JSON object before writing to the database, a reading from JSON to an array when decoding.

My persistence adapter must transform the model before each SQL operations.

```go
package postgresql

import (
	"context"
	"encoding/json"
	"strings"

	api "go.zenithar.org/pkg/db"
	db "go.zenithar.org/pkg/db/adapter/postgresql"
	"go.zenithar.org/spotigraph/internal/models"
	"go.zenithar.org/spotigraph/internal/repositories"

	sq "github.com/Masterminds/squirrel"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

type pgSquadRepository struct {
	adapter *db.Default
}

// NewSquadRepository returns an initialized PostgreSQL repository for squads
func NewSquadRepository(cfg *db.Configuration, session *sqlx.DB) repositories.Squad {
	// Defines allowed columns
	defaultColumns := []string{
		"id", "name", "meta", "product_owner_id", "member_ids",
	}

	// Sortable columns
	sortableColumns := []string{
		"name", "product_owner_id",
	}

	return &pgSquadRepository{
		adapter: db.NewCRUDTable(session, "", SquadTableName, defaultColumns, sortableColumns),
	}
}

// ------------------------------------------------------------

type sqlSquad struct {
	ID             string `db:"id"`
	Name           string `db:"name"`
	Meta           string `db:"meta"`
	ProductOwnerID string `db:"product_owner_id"`
	MemberIDs      string `db:"member_ids"`
}

func toSquadSQL(entity *models.Squad) (*sqlSquad, error) {
	meta, err := json.Marshal(entity.Meta)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	members, err := json.Marshal(entity.MemberIDs)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return &sqlSquad{
		ID:             entity.ID,
		Name:           entity.Name,
		Meta:           string(meta),
		MemberIDs:      string(members),
		ProductOwnerID: entity.ProductOwnerID,
	}, nil
}

func (dto *sqlSquad) ToEntity() (*models.Squad, error) {
	entity := &models.Squad{
		ID:             dto.ID,
		Name:           dto.Name,
		ProductOwnerID: dto.ProductOwnerID,
	}

	// Decode JSON columns

	// Metadata
	err := json.Unmarshal([]byte(dto.Meta), &entity.Meta)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	// Membership
	err = json.Unmarshal([]byte(dto.MemberIDs), &entity.MemberIDs)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return entity, nil
}

// ------------------------------------------------------------

func (r *pgSquadRepository) Create(ctx context.Context, entity *models.Squad) error {
	// Validate entity first
	if err := entity.Validate(); err != nil {
		return err
	}

	// Convert to DTO
	data, err := toSquadSQL(entity)
	if err != nil {
		return err
	}

	return r.adapter.Create(ctx, data)
}

func (r *pgSquadRepository) Get(ctx context.Context, id string) (*models.Squad, error) {
	var entity sqlSquad

	if err := r.adapter.WhereAndFetchOne(ctx, map[string]interface{}{
		"id": id,
	}, &entity); err != nil {
		return nil, err
	}

	return entity.ToEntity()
}

func (r *pgSquadRepository) Update(ctx context.Context, entity *models.Squad) error {
	// Validate entity first
	if err := entity.Validate(); err != nil {
		return err
	}

	// Intermediary DTO
	obj, err := toSquadSQL(entity)
	if err != nil {
		return err
	}

	return r.adapter.Update(ctx, map[string]interface{}{
		"name":             obj.Name,
		"meta":             obj.Meta,
		"product_owner_id": obj.ProductOwnerID,
		"member_ids":       obj.MemberIDs,
	}, map[string]interface{}{
		"id": entity.ID,
	})
}
```

## MongoDB

Another example with a `NoSQL persistence adapter`.

```go
package mongodb

import (
	"context"

	mongowrapper "github.com/opencensus-integrations/gomongowrapper"
	api "go.zenithar.org/pkg/db"
	db "go.zenithar.org/pkg/db/adapter/mongodb"
	"go.zenithar.org/spotigraph/internal/models"
	"go.zenithar.org/spotigraph/internal/repositories"
)

type mgoSquadRepository struct {
	adapter *db.Default
}

// NewSquadRepository returns an initialized MongoDB repository for squads
func NewSquadRepository(cfg *db.Configuration, session *mongowrapper.WrappedClient) repositories.Squad {
	return &mgoSquadRepository{
		adapter: db.NewCRUDTable(session, cfg.DatabaseName, SquadTableName),
	}
}

// ------------------------------------------------------------

func (r *mgoSquadRepository) Create(ctx context.Context, entity *models.Squad) error {
	// Validate entity first
	if err := entity.Validate(); err != nil {
		return err
	}

	return r.adapter.Insert(ctx, entity)
}

func (r *mgoSquadRepository) Get(ctx context.Context, id string) (*models.Squad, error) {
	var entity models.Squad

	if err := r.adapter.WhereAndFetchOne(ctx, map[string]interface{}{
		"id": id,
	}, &entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mgoSquadRepository) Update(ctx context.Context, entity *models.Squad) error {
	// Validate entity first
	if err := entity.Validate(); err != nil {
		return err
	}

	return r.adapter.Update(ctx, map[string]interface{}{
		"name":             entity.Name,
		"meta":             entity.Meta,
		"product_owner_id": entity.ProductOwnerID,
	}, map[string]interface{}{
		"id": entity.ID,
	})
}

func (r *mgoSquadRepository) Delete(ctx context.Context, id string) error {
	return r.adapter.Delete(ctx, id)
}

func (r *mgoSquadRepository) FindByName(ctx context.Context, name string) (*models.Squad, error) {
	var entity models.Squad

	if err := r.adapter.WhereAndFetchOne(ctx, map[string]interface{}{
		"name": name,
	}, &entity); err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *mgoSquadRepository) AddMembers(ctx context.Context, id string, users ...*models.User) error {
	// Retrieve squad entity
	entity, err := r.Get(ctx, id)
	if err != nil {
		return err
	}

	// Add user as members
	for _, u := range users {
		entity.AddMember(u)
	}

	// Update members only
	return r.adapter.Update(ctx, map[string]interface{}{
		"member_ids": entity.MemberIDs,
	}, map[string]interface{}{
		"id": entity.ID,
	})
}

func (r *mgoSquadRepository) RemoveMembers(ctx context.Context, id string, users ...*models.User) error {
	// Retrieve squad entity
	entity, err := r.Get(ctx, id)
	if err != nil {
		return err
	}

	// Remove user from members
	for _, u := range users {
		entity.RemoveMember(u)
	}

	// Update members
	return r.adapter.Update(ctx, map[string]interface{}{
		"member_ids": entity.MemberIDs,
	}, map[string]interface{}{
		"id": entity.ID,
	})
}
```

> Never update a full object without controlling each keys, you must setup update function to update only `updatable` attributes.

## Remote Adapter

Your adapter could be an external service which provides data and is called via a transport protocol (HTTP, gRPC, etc.)

> Mocks could be used to simulate remote access during tests.

# Running integration tests

In order to run integration tests with Golang, you must prepare a `TestMain` . This runner is responsible for building all related `persistence adapter instance` according to requested command line flag. 

The test specification will be used to generate the full scenario test by passing the persistence adapter to the generator.

> Obviously, all persistence adapter implementations should have the same behavior, validated by your test suite.

```go
// +build integration

package integration

import (
	"context"
	"flag"
	"fmt"
	"math/rand"
	"os"
	"strings"
	"testing"
	"time"

	"go.uber.org/zap"
	"go.zenithar.org/pkg/log"
	"go.zenithar.org/pkg/testing/containers/database"
	"go.zenithar.org/spotigraph/internal/version"
)

var databases = flag.String("databases", "postgresql", "Repositories backend to use, splitted with a coma ','. Example: postgresql,mongodb,rethinkdb")

func init() {
	flag.Parse()

	ctx := context.Background()

	// Prepare logger
	log.Setup(ctx, &log.Options{
		Debug:     true,
		AppName:   "spotigraph-integration-tests",
		AppID:     "123456",
		Version:   version.Version,
		Revision:  version.Revision,
		SentryDSN: "",
	})

	// Initialize random seed
	rand.Seed(time.Now().UTC().Unix())

	// Set UTC for all time
	time.Local = time.UTC
}

func testMainWrapper(m *testing.M) int {
	if testing.Short() {
		fmt.Println("Skipping integration tests")
		return 0
	}

	log.Bg().Info("Initializing test DB for integration test (disable with `go test -short`)")

	ctx := context.Background()
	backends := strings.Split(strings.ToLower(*databases), ",")

	for _, back := range backends {
		switch back {
		case "postgresql":
			// Initialize postgresql
			cancel, err := postgreSQLConnection(ctx)
			if err != nil {
				log.Bg().Fatal("Unable to initialize repositories", zap.Error(err))
			}
			defer func() {
				cancel()
			}()
		default:
			log.Bg().Fatal("Unsupported backend", zap.String("backend", back))
		}
	}

	defer func() {
		database.KillAll(ctx)
	}()

	return m.Run()
}

// TestMain is the test entrypoint
func TestMain(m *testing.M) {
	os.Exit(testMainWrapper(m))
}
```

It will initialize a Docker container running a PostgreSQL server using `ory-am/dockertest`. It will automate the database server deployment when executing the tests in local and could be used also on a remote database instance (when managing database execution with your CI pipeline for example).

```go
package database

import (
	"fmt"
	"log"

	// Load driver if not already done
	_ "github.com/lib/pq"

	"github.com/dchest/uniuri"
	dockertest "gopkg.in/ory-am/dockertest.v3"

	"go.zenithar.org/pkg/testing/containers"
)

var (
	// PostgreSQLVersion defines version to use
	PostgreSQLVersion = "10"
)

// PostgreSQLContainer represents database container handler
type postgreSQLContainer struct {
	Name     string
	pool     *dockertest.Pool
	resource *dockertest.Resource
	config   *Configuration
}

// NewPostgresContainer initialize a PostgreSQL server in a docker container
func newPostgresContainer(pool *dockertest.Pool) *postgreSQLContainer {

	var (
		databaseName = fmt.Sprintf("test-%s", uniuri.NewLen(8))
		databaseUser = fmt.Sprintf("user-%s", uniuri.NewLen(8))
		password     = uniuri.NewLen(32)
	)

	// Initialize a PostgreSQL server
	resource, err := pool.Run("postgres", PostgreSQLVersion, []string{
		fmt.Sprintf("POSTGRES_PASSWORD=%s", password),
		fmt.Sprintf("POSTGRES_DB=%s", databaseName),
		fmt.Sprintf("POSTGRES_USER=%s", databaseUser),
	})
	if err != nil {
		log.Fatalf("Could not start resource: %s", err)
	}

	// Prepare connection string
	connectionString := fmt.Sprintf("postgres://%s:%s@localhost:%s/%s?sslmode=disable", databaseUser, password, resource.GetPort("5432/tcp"), databaseName)

	// Retrieve container name
	containerName := containers.GetName(resource)

	// Return container information
	return &postgreSQLContainer{
		Name:     containerName,
		pool:     pool,
		resource: resource,
		config: &Configuration{
			ConnectionString: connectionString,
			Password:         password,
			DatabaseName:     databaseName,
			DatabaseUser:     databaseUser,
		},
	}
}

// -------------------------------------------------------------------

// Close the container
func (container *postgreSQLContainer) Close() error {
	log.Printf("Postgres (%v): shutting down", container.Name)
	return container.pool.Purge(container.resource)
}

// Configuration return database settings
func (container *postgreSQLContainer) Configuration() *Configuration {
	return container.config
}
```

The connection builder that try to connect and build the database schema by running migrations.

```go
// +build integration

package integration

import (
	"context"

	"github.com/pkg/errors"
	"go.uber.org/zap"

	"go.zenithar.org/pkg/log"
	"go.zenithar.org/pkg/testing/containers/database"
	"go.zenithar.org/spotigraph/internal/repositories/pkg/postgresql"
)

func postgreSQLConnection(ctx context.Context) (func(), error) {
	// Initialize connection and/or container
	conn, _, err := database.ConnectToPostgreSQL(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "unable to initialize database server")
	}

	// Try to contact server
	if err = conn.Ping(); err != nil {
		return nil, errors.Wrap(err, "unable to contact database")
	}

	// Migrate schema
	n, err := postgresql.CreateSchemas(conn)
	if err != nil {
		return nil, errors.Wrap(err, "unable to initialize database schema")
	}

	// Log migration
	log.For(ctx).Info("Applyied migrations to database", zap.Int("level", n))

	// Build repositories
	userRepositories["postgresql"] = postgresql.NewUserRepository(nil, conn)

	// Return result
	return func() {
		log.SafeClose(conn, "unable to close connection")
	}, nil
}
```

> Complete integration test suite could be found here - <https://github.com/Zenithar/go-spotigraph/blob/master/internal/repositories/test/integration/main_test.go>

# Conclusion

At this point, you must be able to `execute` all test suites on your domain as `persistence adapters`. You should be able to create business service by using these `adapters` via the interface, NOT DIRECTLY via adapter instance. All persistence adapters are constraint by contract defined in the `api.go`, from the public side, all adapter user must fit and stick with this interface to be sure to have `port` and `interface` in the `persistence` layer. By doing this you will fit with Hexagonal architecture principles.

In the next post, we will start to prepare the service by declaring a protocol, and contracts to be used by dispatchers to communicate with business services.

## References

- [Github Spotigraph](https://github.com/Zenithar/go-spotigraph)
- [PostgreSQL PGX Driver](https://github.com/jackc/pgx)
- [PostgreSQL query builder](https://github.com/Masterminds/squirrel)