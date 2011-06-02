# node-koku
### Koku bindings for node.js

This simple module uses [node-applescript](https://github.com/TooTallNate/node-applescript) to allow easy input and output of data from the Mac OS X finance application [Koku](http://www.fadingred.com/koku/). If you use Koku, this wrapper might help you write your own financial information importer (in the absence of first party DirectConnect functionality for your bank) or other utility.

## Usage

First of all:

	npm install koku

Then:

```javascript
var Koku = require("koku");
var kokuInstance = new Koku(); // Asynchronous

// Document list
// returns array of KokuDocument objects
kokuInstance.documents;

// Account list
// returns array of KokuAccount objects
kokuInstance.documents[0].accounts;

// Tags
// returns array of KokuTag objects
kokuInstance.documents[0].tags;

// Transactions for account
kokuInstance.documents[0].loadTransactions(); // Asynchronous
// returns array of KokuTransaction objects
kokuInstance.documents[0].transactions;

```

...more documentation to come soon.

## Notes

For the moment, the `KokuAccount.loadTransactions()` method is _very_ slow - and as a result will not execute automatically. I'm looking into performance improvements, and refactoring the method, but the issue seems to just be that Apple events are slow.

The `Koku()` constructor and the `KokuAccount.loadTransactions()` methods are asynchronous. The former will most likely execute in under ~250msec depending on the size of your Koku library and how many documents you've got open.

The `Koku`, `KokuDocument`, `KokuAccount`, `KokuTag`, and `KokuTransaction` objects are designed to mirror as closely as possible their equivalents in the Koku AppleScript dictionary.