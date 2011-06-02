on run argv
	tell application "Koku"
		set JSONAccountList to ""
		set currentDocument to document (item 1 of argv)
		set accountList to accounts in currentDocument
		repeat with accountIndex from 1 to number of accountList
			set currentAccount to account accountIndex of currentDocument
			if length of JSONAccountList > 0 then
				set JSONAccountList to JSONAccountList & ","
			end if
			set JSONAccountList to JSONAccountList & "{\"id\":\"" & (id of currentAccount) & "\","
			set JSONAccountList to JSONAccountList & "\"name\":\"" & (name of currentAccount) & "\","
			set JSONAccountList to JSONAccountList & "\"index\":" & (accountIndex) & ","
			set JSONAccountList to JSONAccountList & "\"active\":\"" & (active of currentAccount) & "\"}"
		end repeat
		return "[" & JSONAccountList & "]"
	end tell
end run