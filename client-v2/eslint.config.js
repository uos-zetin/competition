import js from "@eslint/js";
import fsdPlugin from "eslint-plugin-fsd-lint";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist"],
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      fsd: fsdPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-duplicate-imports": "error",
      "react-hooks/incompatible-library": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/await-thenable": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000"],
            ["^node:"],
            ["^react$", "^react-"],
            ["^@?\\w"],
            ["^@/shared/", "^@/entities/", "^@/features/", "^@/widgets/", "^@/pages/", "^@/app/"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "Program > :not(ImportDeclaration) ~ ImportDeclaration",
          message: "모든 import 선언은 파일의 실행문보다 앞에 있어야 합니다.",
        },
        {
          selector: "TSAsExpression > TSAsExpression[typeAnnotation.type='TSUnknownKeyword']",
          message: "`as unknown as` 이중 단언은 금지합니다. 타입 가드 또는 검증 함수를 사용하세요.",
        },
      ],
      "fsd/forbidden-imports": [
        "error",
        {
          alias: {
            value: "@",
            withSlash: false,
          },
        },
      ],
      "fsd/no-relative-imports": [
        "error",
        {
          allowSameSlice: true,
        },
      ],
      "fsd/no-public-api-sidestep": "error",
      "fsd/no-cross-slice-dependency": "error",
      "fsd/no-ui-in-business-logic": "error",
      "fsd/no-global-store-imports": "error",
    },
  }
);
