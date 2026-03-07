<p align="center">
  <h3 align="center">{{project_name}}</h3>
</p>

## 🗂 Table of Contents

- [About the Project](#about-the-project)
- [Technologies](#technologies)
- [Installation](#installation)
  {{#if env_vars}}\* [Environment Variables](#environment-variables){{/if}}
- [License](#license)
- [Author](#author)

## :book: About The Project

{{description}}

### :computer: Technologies

{{tech_list}}

## :bricks: Installation

### :construction: Prerequisites

Clone this project repository:

```bash
$ git clone https://github.com/{{author}}/{{project_name}}.git
$ cd {{project_name}}
```

### :construction: Installing Dependencies

```bash
$ yarn install
```

{{#if env_vars}}

### :wrench: Environment Variables

Create a `.env` file with the following keys:

```
{{env_vars}}
```

{{/if}}

{{#if has_docker}}

### :whale: Running with Docker

```bash
$ docker build -t {{project_name}} .
$ docker run -d -p {{docker_port}}:{{docker_port}} {{project_name}}
```

{{/if}}

### :arrow_forward: Running

```bash
$ yarn dev
```

## :page_facing_up: License

This project uses [{{license}}] license.

## :technologist: Author

[{{author}}](https://github.com/{{github_user}})
