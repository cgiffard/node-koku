on run argv
	tell application "Koku"
		set JSONTagList to ""
		set currentDocument to document (item 1 of argv)
		set tagList to tags in currentDocument
		repeat with currentTag in tagList
			if length of JSONTagList > 0 then
				set JSONTagList to JSONTagList & ","
			end if
			set JSONTagList to JSONTagList & "{\"id\":\"" & (id of currentTag) & "\","
			set JSONTagList to JSONTagList & "\"name\":\"" & (name of currentTag) & "\"}"
		end repeat
		return "[" & JSONTagList & "]"
	end tell
end run