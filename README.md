# Quickstart for Bitasmbl project (React)

## 1) Install Bitasmbl-CLI package

```bash
npm i bitasmbl-cli
```

## 2) Run bitasmbl command to set up the project

```bash
bitasmbl pull --repoUrl https://github.com/he1snber8/Bitasmbl_im-tha-greatest-rn_b88_414 --appId 414 --repoId 238
```

## 3) Enter into the main directory and start coding!

```bash
cd Bitasmbl_im-tha-greatest-rn_b88_414
```

## Customize requirements in a way you like

Bitasmbl organizes development into requirements. Each requirement describes a feature or implementation goal and can define suggested file locations through a `paths` array.

The `paths` property acts as a mapping guideline, helping contributors understand where related code should live.

You can customize `paths` mappings through the `bitasmbl.json` file.

{"Requirement":"Define portfolio layout","Paths":["**/src/layouts/**","**/src/components/layout/**","**/src/pages/**"]}

## Requirement Evaluation

Bitasmbl includes a requirement evaluation workflow that lets contributors select a task and submit work for validation.

Run:

```bash
bitasmbl evaluate
```

Example output:

<pre>
? Available Requirements:

❯ [<span style="color:#9333ea">1</span>] <span style="color:#9333ea"> Define portfolio layout </span>            [3]
  [2] Build showcase components            [3]
  [3] Implement navigation routing         [3]
</pre>

`[x]` on the right represents the number of submission attempts remaining for a requirement.

## Example evaluation result

```tsx
/*
|--------------------------------------------------------------------------
| BITASMBL EVALUATION
|--------------------------------------------------------------------------
| REQUIREMENT:
| Build showcase components
|
| SCORE: 22/100
| STATUS: FAIL ✕
|
| INSIGHT:
| The component renders static content and does not use reusable props,
| typed data, responsive layout structure, or component composition.
|--------------------------------------------------------------------------
*/

const projects = [
  {
    title: "Portfolio Website",
    description: "Personal portfolio project",
  },
  {
    title: "E-commerce UI",
    description: "Product showcase interface",
  },
];

export default function Showcase() {
  return (
    <section>
      <h1>My Work</h1>

      {projects.map((project) => (
        <div key={project.title}>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
        </div>
      ))}
    </section>
  );
}
```


## Learn More

For complete command references, workflow explanations, and additional documentation, visit:

👉 [Bitasmbl Documentation](https://bitasmbl.com/docs)
