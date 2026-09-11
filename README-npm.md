# @adaptic/backend-legacy

![Adaptic Readme Banner](https://adaptic-public.s3.ap-southeast-2.amazonaws.com/adaptic-readme-banner.png?=1)

## Description

The `@adaptic/backend-legacy` NPM package provides a comprehensive set of executable CRUD (Create, Read, Update, Delete) functions, type and enums definitions, tailored for the Adaptic AI platform. Designed for both client-side and server-side applications, it leverages the power of **Apollo Client** for GraphQL interactions, and **TypeGraphQL** for building type-safe APIs.

It's primary goal, is to enabled developers to quickly scaffold and interact with their data models, without the need to write elaborate gql operations, or lack certainty of what data to pass through as variables or arguments. Rather, the executable CRUD functions are generated dynamically based on the models defined in the project, and are accessible under the global `adaptic` namespace. Rather than requiring various inputTypes, you simply pass through the data as an object that conforms to the corresponding model's type definition, and the package will handle the rest, irrespective of mutation or query operation being performed.

This package streamlines the development process by offering a unified `adaptic` namespace, encompassing model-specific functions, types, and enums, ensuring consistency and type safety across your application.

## Features

This package offers a robust backend solution tailored for the Adaptic AI platform, featuring:

- **Dynamic Model Functions**: Automatically generated CRUD functions for each content model.
- **Unified Namespace**: Access all functions, types, and enums under the global `adaptic` namespace.
- **Type Safety**: Comprehensive type definitions ensure consistency and reduce runtime errors.
- **GraphQL Integration**: Seamless interaction with GraphQL endpoints using Apollo Client.
- **Dynamically contructed variables and arguments**: No need to worry about constructing gql operations, simply pass through the data as an object that conforms to the model's type definition.
- **Server-Side and Client-Side Support**: Versatile usage in both environments, including AWS Lambda functions.
- **Enums Namespace**: Organized enums for consistent value usage across models.
- **TypeStrings Namespace**: TypeStrings const definitions that are stringified versions of the various model types (including any nested types or enums within them). This is useful when wanting to pass these on to an LLM as a reference (e.g. when asking it to return a specific type of data).
- **Automated Documentation**: The build script dynamically generates a list of all models and their CRUD resolvers in the `README.md`.

## Prerequisites

To use the `@adaptic/backend-legacy` package, the only requirement is to ensure you have several environment variables configured (see below). This can be a local development server or a production endpoints for the graphql server, and the corresponding HTTPS and WebSocket URLs.

### Environment Variables

Add the folowing to your `.env` file or add them as environment variables in your deployment environment:

- `BACKEND_HTTPS_URL`: The HTTPS URL of your GraphQL server. E.g. `https://stable-api.adaptic.ai/graphql` for production, and `https://localhost:4000/graphql` for local development.

Example `.env` file:

```plaintext
GRAPHQL_ENDPOINT=http://localhost:4000/graphql
BACKEND_HTTPS_URL=https://api.example.com/graphql
BACKEND_WS_URL=wss://api.example.com/subscriptions
```

## Installation

To install the `@adaptic/backend-legacy` package, follow these steps:

1. **Install NPM Package**:

   ```bash
   npm @adaptic/backend-legacy
   ```

2. **Set Up Environment Variables**:
   Create a `.env` file in the root of the project and add:
   ```plaintext
   GRAPHQL_ENDPOINT=http://localhost:4000/graphql // Or any other port you wish to use for the server
   ```

## Usage

### Adaptic Namespace

All the dynamically generated functions for each content model are available under the global `adaptic` namespace. You can import and use them in your application as follows:

#### Client-Side Usage (Root Level)

```typescript
// client-side/index.ts
import adaptic, { types, enums } from '@adaptic/backend-legacy';

export const main = async () => {
  // Example: Create a new User
  const userProps = {
    name: 'John Doe',
    email: 'john@gmail.com',
    image: 'https://example.com/johndoe.jpg',
    role: 'ADMIN',
  } as types.User;

  try {
    const createdUser = (await adaptic.User.create(userProps)) as types.User;
    console.log('Created User:', createdUser);
  } catch (error) {
    console.error('Error creating user:', error);
  }

  // Example: Update a User
  const updateUser = async () => {
    const updateProps: types.User = {
      id: 'USER_ID',
      email: 'newemail@example.com',
    };

    try {
      const updatedUser = (await adaptic.User.update(
        updateProps
      )) as types.User;
      console.log('Updated User:', updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Execute functions
  createUser();
  updateUser();
};
```

#### Server-Side Usage (Within a Lambda Function)

The only difference between client-side and server-side usage is the import statement. On the server-side, you import the functions from `@adaptic/backend-legacy/server/index` instead of `@adaptic/backend-legacy`, and you need to provide an Apollo Client instance to the functions with the use of 'fetch' for the HTTP link.

```javascript
// server-side/lambdaFunction.mjs
import adaptic from '@adaptic/backend-legacy/server/index';

export const handler = async (event) => {
  // Parse the incoming event data
  const data = JSON.parse(event.body);

  // Validate the input
  if (
    !data.name ||
    !data.type ||
    !data.version ||
    !data.url ||
    !data.website ||
    !data.description
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          'Missing required fields: name, type, version, url, website, description',
      }),
    };
  }

  const dependencyObject = {
    name: data.name,
    type: data.type,
    version: data.version,
    url: data.url,
    website: data.website,
    description: data.description,
  };

  try {
    const result = await adaptic.dependency.create(dependencyObject);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error in createOneDependency:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'An error occurred',
        details: error.message,
      }),
    };
  }
};
```

### Types Namespace

Types associated with your data models are available under the `types` namespace. This provides type safety and consistency when working with your models.

```typescript
// types-example.ts
import { types } from '@adaptic/backend-legacy';

// Define a new user
const newUser: types.UserCreateInput = {
  username: 'johndoe',
  email: 'johndoe@example.com',
  password: 'securepassword',
  role: types.UserRole.ADMIN, // Using enums
};

// Define update input
const updateUser: types.UserUpdateInput = {
  id: 'USER_ID',
  email: 'john.doe@newdomain.com',
};
```

### Enums Namespace

Enums associated with your data models are available under the `enums` namespace. This provides type safety and consistency when working with your models.

```typescript
// enums-example.ts
import { enums } from '@adaptic/backend-legacy';

// Assign a user role
const userRole: enums.UserRole = enums.UserRole.MODERATOR;

// Use enums in functions
const setUserRole = (role: enums.UserRole) => {
  // Function logic
};
```

### TypeStrings Namespace

TypeStrings are stringified versions of the various model types (including any nested types or enums within them). These are available under the `typeStrings` namespace.

Their purpose is to provide a reference to the type of data being requested, which can be passed on to an LLM (Language Learning Model) as a reference within a prompt or query. This is useful when asking the LLM to return a specific type of data that should conform to the model's structure.

```typescript
// typeStrings-example.ts

import { typeStrings } from '@adaptic/backend-legacy';

// Use typeStrings in a prompt being sent to an LLM
const prompt = `

... some other prompt text

\${typeStrings.User}

`;
```

### Model CRUD Resolvers

The `@adaptic/backend-legacy` package includes a comprehensive set of CRUD (Create, Read, Update, Delete) resolvers for each of your models. Each model has the following functions:

- `ModelName.create`: Create a single record.
- `ModelName.createMany`: Create multiple records.
- `ModelName.update`: Update a single record.
- `ModelName.delete`: Delete a single record.
- `ModelName.get`: Retrieve a single record by unique identifier.
- `ModelName.getAll`: Retrieve all records.
- `ModelName.findMany`: Retrieve multiple records based on criteria.
