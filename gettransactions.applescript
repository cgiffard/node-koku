on run argv
	tell application "Koku"
		set JSONTransactionList to ""
		set currentAccount to account (item 2 of argv as number) of document (item 1 of argv)
		set transactionList to transactions in currentAccount
		repeat with currentTransaction in transactionList
			if length of JSONTransactionList > 0 then
				set JSONTransactionList to JSONTransactionList & ","
			end if
			set JSONTransactionList to JSONTransactionList & "{\"id\":\"" & (id of currentTransaction) & "\","
			set JSONTransactionList to JSONTransactionList & "\"date\":\"" & (date of currentTransaction) & "\","
			set JSONTransactionList to JSONTransactionList & "\"deposit\":\"" & (deposit of currentTransaction) & "\","
			set JSONTransactionList to JSONTransactionList & "\"description\":\"" & (description of currentTransaction) & "\","
			set JSONTransactionList to JSONTransactionList & "\"locked\":" & (locked of currentTransaction) & ","
			set JSONTransactionList to JSONTransactionList & "\"seen\":" & (seen of currentTransaction) & ","
			set JSONTransactionList to JSONTransactionList & "\"withdrawal\":\"" & (withdrawal of currentTransaction) & "\"}"
		end repeat
		return "[" & JSONTransactionList & "]"
	end tell
end run