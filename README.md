# 📖 Generate-Me-Docs

**` generate-me-docs ` is a command-line tool that can be used to generate documentation for your projects from your project's source. The tool is available on NPm**

> [!TIP]
> **Install Globally:**
> ```bash
> npm install -g generate-me-docs
> ```

## 🪴 Usage
To use ` generate-me-docs `, you must provide the name of the folder containing the source files and your Gemini API key. The tool will automatically generate a set of MARKDIWN files!.

```bash
npx generate-me-docs [folder] [apiKey] <extraRequests> 
```

## 🥠 Props 

| Prop          | Description                 | Required |
| ------------- | --------------------------- | -------- |
| folder        | Source files folder         | true     |
| apiKey        | Google's Gemini API Key      | true     |
| extraRequests | Extra requests you want to pass | false    |


# 💯 Example
```diff
+ npx generate-me-docs src apikeyxyz "Add Some Emojis Too"
```

---