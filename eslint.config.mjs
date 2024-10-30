import pkg from 'globals';
const { node, commonjs, es2020, browser } = pkg;

export default [
 { 
    files: ["**/*.js"],
    languageOptions: {
        ecmaVersion: 2020,
        globals: {
          Atomics: 'readonly',
          SharedArrayBuffer: 'readonly',
          process: true,
          $: 'readonly',
          jQuery: 'readonly',
          ...node, // Include Node.js globals
          ...commonjs,
          ...es2020,
          ...browser,
          module: 'readonly' // Define 'module' as a global variable
        },
        sourceType: 'module' // Use 'module' if you are using ES modules
      },
//   pluginJs.configs.recommended,
  rules: {
    "no-multiple-empty-lines": "warn",
    "indent": ["error", "tab"],
    "no-tabs": "off",
    "quotes": ["error", "double"],
    "no-console": "off",
    "no-const-assign": "off",
    // "linebreak-style": ["error", "unix"],
    "semi": ["error", "always"],
    "comma-dangle": "error", // disallow or enforce trailing commas
    "no-cond-assign": "error", // disallow assignment in conditional expressions
    "no-constant-condition": "error", // disallow use of constant expressions in conditions
    "no-control-regex": "error", // disallow control characters in regular expressions
    "no-debugger": "error", // disallow use of debugger
    "no-dupe-args": "error", // disallow duplicate arguments in functions
    "no-dupe-keys": "error", // disallow duplicate keys when creating object literals
    "no-duplicate-case": "error", // disallow a duplicate case label.
    "prefer-const": ["error", { "destructuring": "all", "ignoreReadBeforeAssign": false }],
    "no-empty": "error", // disallow empty statements
    "no-ex-assign": "error", // disallow assigning to the exception in a catch block
    "no-extra-boolean-cast": "error", // disallow double-negation boolean casts in a boolean context
    "no-extra-parens": "off", // disallow unnecessary parentheses (off by default)
    "no-extra-semi": "error", // disallow unnecessary semicolons
    "no-func-assign": "error", // disallow overwriting functions written as function declarations
    "no-inner-declarations": "error", // disallow function or variable declarations in nested blocks
    "no-invalid-regexp": "error", // disallow invalid regular expression strings in the RegExp constructor
    "no-irregular-whitespace": "error", // disallow irregular whitespace outside of strings and comments
    "no-negated-in-lhs": "error", // disallow negation of the left operand of an in expression
    "no-obj-calls": "error", // disallow the use of object properties of the global object (Math and JSON) as functions
    "no-regex-spaces": "error", // disallow multiple spaces in a regular expression literal
    "no-sparse-arrays": "error", // disallow sparse arrays
    "no-unreachable": "error", // disallow unreachable statements after a return, throw, continue, or break statement
    "use-isnan": "error", // disallow comparisons with the value Na
    "valid-typeof": "error", // Ensure that the results of typeof are compared against a valid string
    "block-scoped-var": "off", // treat var statements as if they were block scoped (off by default). 0: deep destructuring is not compatible
    "complexity": "off", // specify the maximum cyclomatic complexity allowed in a program (off by default)
    "consistent-return": "error", // require return statements to either always or never specify values
    "curly": "error", // specify curly brace conventions for all control statements
    "default-case": "error", // require default case in switch statements (off by default)
    "guard-for-in": "error", // make sure for-in loops have an if statement (off by default)
    "no-alert": "error", // disallow the use of alert, confirm, and prompt
    "no-caller": "error", // disallow use of arguments.caller or arguments.callee
    "no-div-regex": "error", // disallow division operators explicitly at beginning of regular expression (off by default)
    "no-else-return": "error", // disallow else after a return in an if (off by default)
    "no-eq-null": "error", // disallow comparisons to null without a type-checking operator (off by default)
    "no-eval": "error", // disallow use of eval()
    "no-extra-bind": "error", // disallow unnecessary function binding
    "no-fallthrough": "error", // disallow fallthrough of case statements
    "no-floating-decimal": "error", // disallow the use of leading or trailing decimal points in numeric literals (off by default)
    "no-implied-eval": "error", // disallow use of eval()-like methods
    "no-iterator": "error", // disallow usage of __iterator__ property
    "no-labels": "off", // disallow use of labeled statements
    "no-lone-blocks": "error", // disallow unnecessary nested blocks
    "no-loop-func": "error", // disallow creation of functions within loops
    "no-multi-spaces": "error", // disallow use of multiple spaces
    "no-multi-str": "error", // disallow use of multiline strings
    "no-native-reassign": "error", // disallow reassignments of native objects
    "no-new": "error", // disallow use of new operator when not part of the assignment or comparison
    "no-new-func": "error", // disallow use of new operator for Function object
    "no-new-wrappers": "error", // disallows creating new instances of String,Number, and Boolean
    "no-octal": "error", // disallow use of octal literals
    "no-octal-escape": "error", // disallow use of octal escape sequences in string literals
    "no-proto": "error", // disallow usage of __proto__ property
    "no-redeclare": "off", // disallow declaring the same variable more than once
    "no-return-assign": "error", // disallow use of assignment in return statement
    "no-script-url": "error", // disallow use of javascript: urls.
    "no-self-compare": "error", // disallow comparisons where both sides are exactly the same (off by default)
    "no-sequences": "error", // disallow use of comma operator
    "no-throw-literal": "error", // restrict what can be thrown as an exception (off by default)
    "no-unused-expressions": "error", // disallow usage of expressions in statement position
    "no-void": "error", // disallow use of void operator (off by default)
    "no-warning-comments": ["off", { "terms": ["todo", "fixme"], "location": "start" }], // disallow usage of configurable warning terms in comments
    "no-with": "error", // disallow use of the with statement
    "radix": "off", // require use of the second argument for parseInt() (off by default)
    "wrap-iife": "error", // require immediate function invocation to be wrapped in parentheses (off by default)
    "yoda": "error", // require or disallow Yoda conditions
    "strict": "off", // controls location of Use Strict Directives
    "no-catch-shadow": "error", // disallow the catch clause parameter name being the same as a variable in the outer scope (off by default in the node environment)
    "no-delete-var": "error", // disallow deletion of variables
    "no-label-var": "error", // disallow labels that share a name with a variable
    "no-undef": "error", // disallow use of undeclared variables unless mentioned in a /*global */ block
    "no-undef-init": "error", // disallow use of undefined when initializing variables
    "no-undefined": "off", // disallow use of undefined variable (off by default)
    "no-prototype-builtins": "off"
},


},

];