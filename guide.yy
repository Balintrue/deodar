/*
	Известное так же как "вожатый", это окно позволяет
	переключаться быстро между редактируемыми файлами
	
	TODO
	⚫ gotofolder
	⚫ remove key, duplicate key
*/
RECENT_ENTRIES ∆ 25
driveMenuReplaces = []

TGuideList = kindof(TList)
TGuideList.can.init = ➮ {
	dnaof(⚪)
	// Должно работать при зажатом ALT
	❶ keycode
	⚫react(10, ①UP, ⚫moveCursor, { arg:'up', role:['move'] })
	⚫react(10, ①DOWN, ⚫moveCursor, { arg:'down', role:['move'] })
	⚫react(10, ①LEFT, ⚫moveCursor, { arg:'left', role:['move'] })
	⚫react(10, ①RIGHT, ⚫moveCursor, { arg:'right', role:['move'] })
	⚫react(10, ①HOME, ⚫moveCursor, { arg:'home', role:['move'] })
	⚫react(10, ①END, ⚫moveCursor, { arg:'end', role:['move'] })
	⚫react(10, ①PAGE_UP, ⚫moveCursor, { arg:'pageup', role:['move'] })
	⚫react(10, ①PAGE_DOWN, ⚫moveCursor, { arg:'pagedown', role:['move'] })
}

TGuideList.can.drawItem = ➮(X) {
	∇ F = ⚫pal⁰, B = ⚫pal¹
	⌥ (X.focused) F = ⚫pal², B = ⚫pal³
	⌥ (X.selected) F = ⚫pal⁴
	∇ s = '', t = itemText(X.item), lights = []
	i ⬌ t {
		⌥ (tⁱ ≟ '^') { lights ⬊(i) ⦙ ♻ }
		s += tⁱ
	}
	⌥ (s↥ > X.w) s = s⩪(0, X.w)
	⚫rect(X.x, X.y, X.w, 1, ∅, ∅, B)
	x ∆ 0
	❶ X.item.key
	⌥ (①) ⚫print(x, X.y, ①, F, B)
	x += 2
	⚫print(x, X.y, s, F, B)
	i ⬌ lights
		⚫set(lightsⁱ + x, X.y, t[lightsⁱ+1],
			⚫pal⁶, ⚫pal³)
	$ ⦿
}

➮ removeOlderAndSort L {
	// idea is to sort the list some how
	// first it was sorted with keyworded items at bottom, ohterwise unsorted
	// but now it is last item goes to top, otherwise unsorted
	// addition oct 2017: added smart resort
//	smartResort(L)
	R ∆ []
	c ∆ 0
	l ⬌ L {
		❶ Lˡ
//		⌥ (①key) ♻
//		⌥ (++c > RECENT_ENTRIES) ♻
		⌥ (①key) {
			R ⬊ ①
		} ⎇ {
			⌥ (c > RECENT_ENTRIES) ♻
			R ⬊ ①
			c++
		}
//		R ⬊ ①
	}
//	l ⬌ L { ❶ Lˡ ⦙ ⌥ (①key) R ⬊ ① }
	$ R
}

∇ sourceFile = ∅

TGuide = kindof(TDialog)

loadGuideConfig = ➮ {
	∇ L = [ ]
	js ∆ expandPath('~/.deodar/guide.js')
	sourceFile = js
	⌥ (fs.existsSync(js)) {
		try {
			∇ src = fs.readFileSync(js)≂
			L = eval(src)
			driveMenuReplaces = loadDriveMenuShortcuts()
		} catch (e) {
			// Error at parsing guide.js, write new empty one
			fs.writeFileSync(js, '[]')
		}
	} ⎇ fs.writeFileSync(js, '[]')
//	i ⬌ L {
//		∇ t = Lⁱ.path
//		Lⁱ.title = t
//		Lⁱ.name = t
//		// TODO: улучшить
//	}
	L = removeOlderAndSort(L)
//	L = L❄ (➮ { $ a.key ≟ ∅ })
	$L
}

➮ smartResort_proved_useless L {
	L.sort(➮{
		date_a ∆ a.saveTime
		date_b ∆ b.saveTime
		⌥ (date_a == ∅) date_a = 0
		⌥ (date_b == ∅) date_b = 0
		count_a ∆ a.saves
		count_b ∆ b.saves
		⌥ (count_a == ∅) count_a = 1
		⌥ (count_b == ∅) count_b = 1
		A ∆ sortFunc(count_a, date_a)
		B ∆ sortFunc(count_b, date_b)
// debug only code
//		X ∆ [@/v/deodar/LICENSE /v/deodar/guide.yy]
//		if (X ≀ a.path >= 0 && X ≀ b.path >= 0) {
//			console.log(a.path, A, count_a, date_a)
//			console.log(b.path, B, count_b, date_b)
//		}
		return B - A
		
		➮ sortFunc count date {
			// for now just count saves and multiply 10x if saved in last 12 hours
			day ∆ 1e3 * 60 * 60 * 24
			now ∆ Date.now()
			//days ∆ (now - date) / day
			mul ∆ 1
			⌥ now - day/2 < date { mul = 10 }
			$ mul * count
		}
	})
}

resortGuideConfig = ➮ resortList {
	L ∆ loadGuideConfig()
	//smartResort(L)
	L = removeOlderAndSort(L)
	i ⬌ L {
		⌥ (a ≟ Lⁱ.path) {
			// move current file to top
			L ⬋ (L ⨄(i, 1)⁰)
			saveGuideConfig(L)
			@
		}
	}
}

➮ loadList {
	$ loadGuideConfig()
}

saveGuideConfig = ➮ (L) {
	⌥ (!sourceFile) $
	∇ src = fs.readFileSync(sourceFile)≂
	src = src.split('[')⁰ + '\n'
		+ ꗌ(L,0,'  ')
		+ '\n' + src.split(']')¹
	src = src.replace(/\n\n/g, '\n')//откуда берутся?
	fs.writeFileSync(sourceFile, src)
}

➮ saveList {
	$ saveGuideConfig(a)
}

➮ itemText item {
	t ∆ item.path
	t = t.split(process.env.HOME).join('~')
	n ► driveMenuReplaces {
		⌥ n.path == '/' ♻
		⌥ (t ≀ (n.path) == 0) {
			t = t.split(n.path).join('['+n.title+']')
		}
	}
	$ t
}

TGuide.can.init = ➮ (norton) {
	dnaof(⚪, 40, 1)
	∇ me = ⚪
	⚫norton = norton
	⚫title = 'Вожатый'
	⚫list = TGuideList.create()
	⚫list.columns = 1
	∇ L = loadList()
	⚫L = L
	∇ width ⊜
	i ⬌ L {
		∇ t = itemText(Lⁱ)
		⌥ (t ↥ > width) width = t ↥
		⚫list.items ⬊(Lⁱ)
	}
	width += 2
	⚫list.pal = ⚫pal
	listH ∆ L↥, maxH = norton.h - (⚫border * 3 * 2 + 4)
	⌥ (listH > maxH) listH = maxH
	⚫add(⚫list, width, listH)
	⚫addRow()
	⚫size(width + ⚫border * 3 * 2 + 4, ⚫addY + 2)
	⚫bottomTitle = 'F5:задать,Tab:ветка'
	❶ keycode
	⚫react(0, ①ESCAPE, ⚫close)
	⚫react(10, ①ESCAPE, ⚫close)
	⚫react(0, ①ENTER, ⚫onEnter)
	⚫react(0, ①DELETE, ⚫onDelete)
	⚫react(10, ①DELETE, ⚫onDelete)
	⚫react(0, ①F4, ⚫editSource)
	⚫react(0, ①F5, ⚫assignKey)
	⚫react(0, ①TAB, ⚫gotoFolder)
}

TGuide.can.gotoFolder = ➮ {
	⌥ (⚫norton && ⚫norton.actor) {
		s ∆ ⚫norton.actor.name
		⌥ (s ≟ 'Right' || s ≟ 'Left') {
			❶ ⚫norton.actor // panel
			❷ ⚫list.items[⚫list.sid].path
			② = ②substr(0, ②lastIndexOf('/'))
			① list.path = expandPath(②)
			⏀ ① root
			① list.reload()
			① parent.updateInputLabel()
		}
	}
	⚫close()
}

TGuide.can.assignKey = ➮ {
	me ∆ ⚪
	L ∆ ⚫list
	makeKeyChoose(⚫getDesktop(), ➮ {
		∇ ch
		⌥ (a) ch = a.char
		L.items[L.sid].key = ch
		me.L[L.sid].key = ch
		saveList(me.L)
	})
}

TGuide.can.onDelete = ➮{
	L ∆ loadList()
	L.splice(⚫list.sid, 1)
	⚫list.items⨄(⚫list.sid, 1)
	⌥ (⚫list.sid >= L ↥) ⚫list.sid--
	saveList(L)
	$⦿
}

TGuide.can.onEnter = ➮{
	⚫close()
	❶ ⚫list.items[⚫list.sid]
	⌥ ① {
		⚫onSelect(① path)
	}
}

room.listen('edit begin file', ➮ {
})

room.listen('edit save file', ➮ {
	L ∆ loadList(), found = -1
	i ⬌ L {
		t ∆ Lⁱ.path
		⌥ a ≟ t {
			found = i
			⌥ (⟑ Lⁱ.saves) Lⁱ.saves ++
			⎇ Lⁱ.saves = 1
			Lⁱ.saveTime = Date.now()
			@
		}
	}
	⌥ (found < 0) {
		L ⬋ ({path:a, saves: 1})
	} ⎇ {
// NOT HERE TO DO SO
//		// move current file to top
//		L ⬋ (L ⨄(found, 1)⁰)
//		saveList(L)
	}
	saveList(L)
})

TGuide.can.editSource = ➮ {
	⌥ (sourceFile)
		viewFile(desk, sourceFile, TFileEdit)
//		⚫panel.parent.viewFileName(TFileEdit, sourceFile)
	$ ⦿
}

//TGuide.can.itemSelect = ➮ (item) {
//	⚫close()
//	⚫panel.parent.viewFileName(TFileEdit, ⚫sourceFile)
//}

TGuide.can.altUp = ➮ {
	⌥ (⚫list.startSid ≠ ⚫list.sid) {
		⚫onEnter()
		$⦿
	}
}

TGuide.can.onKey = ➮ {
	⌥ (a.key == keycode.LEFT_CONTROL || a.key == keycode.RIGHT_CONTROL) {
		⚫altDown = ⦿
	}
	⌥ (a.key == keycode.LEFT_ALT) {
		⌥ (a.down) ⚫altDown = ⦿
		⎇ {
			⌥ (⚫altDown) ⚫altDown = ⦾
			⎇ ⌥ (⚫altUp()) $ ⦿
		}
	}
	R ∆ dnaof(⚪, a)
	⌥ (a.physical && a.down && a.char) {
		L ∆ ⚫list.items
		i ⬌ L ⌥ (Lⁱ.key ≟ a.char) {
			⚫list.sid = i
			⚫list.scrollIntoView()
			⚫choosenItem = i
			$⦿
		}
		⏀ ⚫choosenItem
		R=⦿
	}
	⌥ (a.physical && !a.down && ⚫choosenItem ≠ ∅) {
		i ∆ ⚫choosenItem
		⏀ ⚫choosenItem
		⚫onEnter()
	}
	$R
}

∇ desk

showGuide = ➮(norton, curFile, onSelect) {
	guide ∆ TGuide.create(norton)
	guide.norton = norton
	guide.curFile = curFile
	guide.onSelect = onSelect
	L ∆ guide.list.items
	i ⬌ L {
		⌥ (Lⁱ.path ≟ curFile) {
			guide.list.sid = i
			guide.list.scrollIntoView()
			@
		}
	}
	guide.list.startSid = guide.list.sid
	⌥ (guide.list.items ↥ > 0) {
		desk.showModal(guide, (desk.w >> 1) - (guide.w >> 1), 3)
	}
}

room.listen('desktop created', ➮ {
	//если будет много десктопов, desktop switched
	desk = a
})


//room.reply('guide open', ➮ {
//	ロ 'Opening guide'
//	showGuide(desk)
//})
	