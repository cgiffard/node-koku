/* 

	Node-Koku
	
	Provides a node.js interface to the Mac application Koku.
	At this stage, doesn't support reports, or anything really sophisticated.
	
	Depends on node-applescript (https://github.com/TooTallNate/node-applescript)
	
	Christopher Giffard, 2011
	Share and Enjoy
	
	
	
	Please Note: annotation here is taken from the Koku applescript library
	and should be used to understand how the objets here match to Koku's applescript
	dictionary - they do not document the objects themselves.
	
*/

var applescript = require("applescript");

function getWithJSON(script,callback,arguments) {
	var execCallback = function(error, returnedValue) {
		if (error) {
			throw error;
		} else {
			if (returnedValue.length) {
				try {
					var returnedData = JSON.parse(returnedValue);
					callback(returnedData);
				} catch(error) {
					throw "Failed to get Koku Data - JSON.parse: " + error;
				}
			} else {
				throw "Failed to get Koku Data - nothing returned by applescript.";
			}
		}
	};
	
	if (arguments) {
		applescript.execFile(script,arguments,execCallback);
	} else {
		applescript.execFile(script,execCallback);
	}
}

var Koku = function Koku() {
	this.documents = [];
	this.ready = false;
	
	var KokuObject = this;
	getWithJSON("getdocuments.applescript",function(returnedDocuments) {
		if (returnedDocuments instanceof Array) {
			KokuObject.ready = true;
			for (index in returnedDocuments) {
				KokuObject.documents.push(new KokuDocument(
						returnedDocuments[index].name,
						returnedDocuments[index].file
					));
			}
		}
	});
}

/* 
document n : A document.

elements
	contains accounts, transactions, tags, reports; contained by application.
properties
	name (text, r/o) : The document's name.
	modified (boolean, r/o) : Has the document been modified since the last save?
	file (file, r/o) : The document's location on disk.
responds to
	mktrans, addtag.

*/

// Use filepath as an ID for the document..?
var KokuDocument = function KokuDocument(name,file) {
	this.name = name || "";
	this.file = file || "";
	this.accounts = [];
	this.tags = [];
	this.accountsready = false;
	this.tagsready = false;
	
	var KokuDocument = this;
	getWithJSON("getaccounts.applescript",function(returnedAccounts) {
		if (returnedAccounts instanceof Array) {
			KokuDocument.accountsready = true;
			for (index in returnedAccounts) {
				KokuDocument.accounts.push(new KokuAccount(
						returnedAccounts[index].id,
						returnedAccounts[index].name,
						returnedAccounts[index].active,
						returnedAccounts[index].index,
						KokuDocument
					));
			}
		}
	},[this.name]);
	
	getWithJSON("gettags.applescript",function(returnedTags) {
		if (returnedTags instanceof Array) {
			KokuDocument.tagsready = true;
			for (index in returnedTags) {
				KokuDocument.tags.push(new KokuTag(
						returnedTags[index].id,
						returnedTags[index].name,
						KokuDocument
					));
			}
		}
	},[this.name]);
	
	this.toString = function toString() {
		return this.name;
	};
	
	this.addTag = function addTag() {
		
	};
	
	this.mkTrans = function mkTrans() {
		
	}
}

/*
tag n [inh. item] : A Koku tag object.

elements
	contained by documents, transactions.
properties
	id (text, r/o) : The ID of the tag.
	name (text) : The tag name.

addtag v : Add a tag to a transaction.
	addtag document : The document in which to create the tag.
	to transaction : The transaction to which this tag should be added.
	named text : The name for the tag.
	→ tag : The tag that was added to the transaciton.

*/

var KokuTag = function KokuTag(id, name, document) {
	this.parentDocument = document;
	this.name = name || "";
	this.id = id || "";
	
	this.toString = function toString() {
		return this.name;
	};
}

/*
account n [inh. item] : A Koku account object.

elements
	contains transactions; contained by documents.
properties
	id (text, r/o) : The ID of the account.
	name (text) : The name of the account.
	active (boolean) : Whether the account is active (visible) or not.

*/

var KokuAccount = function KokuAccount(id,name,active,index,parentDoc) {
	this.parentDocument = parentDoc;
	this.id = id || "";
	this.name = name || "";
	this.active = active || false;
	this.index = index;
	this.transactions = [];
	this.transactionsready = false;
	
	this.toString = function toString() {
		return this.name;
	};
	
	var KokuAccount = this;
	this.loadTransactions = function loadTransactions() {
		getWithJSON("gettransactions.applescript",function(returnedTransactions) {
			if (returnedTransactions instanceof Array) {
				KokuDocument.transactionsready = true;
				for (index in returnedTransactions) {
					KokuDocument.transactions.push(new KokuTransaction(
							returnedTransactions[index].id,
							returnedTransactions[index].date,
							returnedTransactions[index].deposit,
							returnedTransactions[index].description,
							returnedTransactions[index].locked,
							returnedTransactions[index].seen,
							returnedTransactions[index].withdrawal,
							KokuAccount
						));
				}
			}
		},[this.parentDocument.name,this.index]);
	};
}

var KokuTransaction = function KokuTransaction(
									id,
									date,
									deposit,
									description,
									locked,
									seen,
									withdrawal,
									parentAccount) {
	
	this.parentAccount = parentAccount;
	this.id = id || "";
	this.date = date || "";
	this.deposit = deposit || 0;
	this.description = description;
	this.locked = locked || false;
	this.seen = seen || false;
	this.withdrawal = withdrawal || 0;
	
	this.toString = function toString() {
		return this.date + " - " + this.description + " - " + (this.deposit || this.withdrawal*-1);
	};
}

module.exports = Koku;