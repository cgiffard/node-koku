tell application "Koku"
	set JSONDocList to ""
	repeat with currentDocument in documents
		if length of JSONDocList > 0 then
			set JSONDocList to JSONDocList & ","
		end if
		set JSONDocList to JSONDocList & "{\"file\":\"" & (file of currentDocument) & "\","
		set JSONDocList to JSONDocList & "\"name\":\"" & (name of currentDocument) & "\"}"
	end repeat
	return "[" & JSONDocList & "]"
end tell