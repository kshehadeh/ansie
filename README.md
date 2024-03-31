# Ansie Monorepo

The Ansie Monorepo is a collection of Ansie projects that are maintained together in a single repository. This repository is managed using Turbo, a tool for managing monorepos. It also uses changesets to manage changes across packages.

## Packages

- [ansie](./packages/ansie/README.md)
- [ansie-cli](./packages/ansie-cli/README.md)
- [ansie-kitchen-sink](./packages/ansie-kitchen-sink/README.md)

## Development

### Setup

```bash
npm i
npx turbo build

# or

npm install turbo -g
npm i
turbo build

```

## Releasing

### Prepare Release

```bash
npm run prep
```

> NOTE: Commit all changes before proceeding

### Version Bump

```bash
npm run ver
```

### Publish Changes

```bash
npm run pub
```
