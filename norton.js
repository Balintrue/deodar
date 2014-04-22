
TNorton = kindof(TGroup)
TNorton.can.init = function(panelW, panelH) {
	panelW >>= 1
	panelH--
	dnaof(this)
	this.name = 'TNorton'
	this.output = TConsole.create(1,1)
	this.left = TFilePanel.create(); this.left.name = 'Left'; this.left.list.name = 'LeftList'
	this.right = TFilePanel.create(); this.right.name = 'Right'
	this.label = TLabel.create('c:\\')
	this.input = TInput.create()
	this.output.fileman = this

	this.add(this.label)
	this.add(this.output)
	this.add(this.left)
	this.add(this.right)
	this.add(this.input)
	this.output.pos(0, 0)
	this.right.pos(panelW, 0)
	this.right.size(panelW, panelH);
	this.left.pos(0, 0); this.left.size(panelW, panelH);
	this.input.pal = getColor.syntaxBlack
	this.label.pal = getColor.syntaxBlack
//	this.input.pal[1] = 0
//	this.input.pal[0] = 0xaaa; this.input.pal[1] = 0x000
	this.input.pos(0, panelH); this.input.size(panelW * 2, 1)
	this.input.setText('')
	this.actor = this.left
	var a = '.', b = '~'
//	a = '/v/deodar/find'
	a = expandPath(a)
	b = expandPath(b)
	this.panelReduce = 0
	this.left.list.load(a)
	this.right.list.load(b)
	this.updateInputLabel()
	this.pos(0, 0)
	this.size(2 * panelW, panelH + 1)

	this.react(10, keycode.F7, this.userFindModal, { arg:this, role:['panel', 'input'] })
	this.react(100, keycode['f'], this.userFindModal, { arg:this, role:['panel', 'input'] })
	this.react(10, keycode.F1, showHelp, { arg:this, role:['panel', 'input'] })
	this.react(0, keycode.TAB, this.switchPanel, {role:['panel']})
	this.react(100, keycode['o'], this.outputFlip, {role:['panel', 'input', 'output']})
	this.react(0, keycode.F1, this.driveMenu, {arg: 'left', role:['panel', 'input']})
	this.react(0, keycode.F2, this.driveMenu, {arg: 'right', role:['panel']})
	this.react(0, keycode.BACK_SPACE, this.smartBackSpace, {role:['panel', 'input']})
	this.react(100, keycode.BACK_SPACE, this.input.commandDeleteWordBack.bind(this.input), {role:['panel', 'input']})

	this.react(0, keycode.ENTER, this.pressEnter, {role:['panel','input']})
	this.react(1, keycode.ENTER, this.runInBackground, {role:['panel','input']})
	this.react(100, keycode.ENTER, this.pressAppendFocusedName, {role:['panel']})
	this.react(100, keycode.UP, this.panelsResize, { arg: 'up', role:['panel'] })
	this.react(100, keycode.DOWN, this.panelsResize, { arg: 'down', role:['panel'] })
	this.react(100, keycode['e'], this.historyNavigate, { arg: 'up', role:['panel','input'] })
	this.react(100, keycode['x'], this.historyNavigate, { arg: 'down', role:['panel','input'] })
	this.react(0, keycode.UP, this.historyNavigate, { arg: 'up', role:['input'] })
	this.react(0, keycode.DOWN, this.historyNavigate, { arg: 'down', role:['input'] })
	this.react(0, keycode.F3, this.viewFile, { arg: TTextView, role:['panel'] })
	this.react(10, keycode.F3, this.viewFile, { arg: THexView, role:['panel'] })
	this.react(0, keycode.F4, this.viewFile, { arg: TFileEdit, role:['panel'] })
	this.react(1, keycode.F4, this.editFileInput, { arg: TFileEdit, role:['panel'] })
	this.react(0, keycode.F5, this.commandCopy, { arg: 'copy', role:['panel'] })
	this.react(0, keycode.F6, this.commandCopy, { arg: 'move', role:['panel'] })
	this.react(0, keycode.F7, this.commandMakeDir, { role:['panel'] })
	this.react(0, keycode.F8, this.commandDelete, { role:['panel'] })

	this.react(100, keycode['k'], this.showKeyCode, {role:['panel','input']})
	this.react(0, keycode.ESCAPE, this.escape, {role:['panel', 'input']})
	this.react(100, keycode.INSERT, this.input.userCopy.bind(this.input), {role:['panel', 'input']})
	this.react(1, keycode.INSERT, this.input.userPaste.bind(this.input), {role:['panel', 'input']})
	this.react(0, keycode.LEFT, this.input.handleCursorKey.bind(this.input), {arg:'left', role:['input']})
	this.react(0, keycode.RIGHT, this.input.handleCursorKey.bind(this.input), {arg:'right', role:['input']})
	this.react(100, keycode.LEFT, this.input.handleCursorKey.bind(this.input),
		{arg:'wordleft', role:['input', 'panel']})
	this.react(100, keycode.RIGHT, this.input.handleCursorKey.bind(this.input),
		{arg:'wordright', role:['input', 'panel']})
	this.react(0, keycode.HOME, this.keyChooser, {arg:'home', role:['input','panel']})
	this.react(0, keycode.END, this.keyChooser, {arg:'end', role:['input','panel']})

	this.react(1, keycode.HOME, this.input.shiftSel.bind(this.input), {arg:'home', role:['input']})
	this.react(1, keycode.END, this.input.shiftSel.bind(this.input), {arg:'end', role:['input']})
	this.react(1, keycode.LEFT, this.input.shiftSel.bind(this.input), {arg:'left', role:['input']})
	this.react(1, keycode.RIGHT, this.input.shiftSel.bind(this.input), {arg:'right', role:['input']})
	this.react(101, keycode.LEFT, this.input.shiftSel.bind(this.input), 
		{arg:'wordleft', role:['panel','input']})
	this.react(101, keycode.RIGHT, this.input.shiftSel.bind(this.input), 
		{arg:'wordright', role:['panel', 'input']})
	this.react(100, keycode['c'], this.output.kill.bind(this.output), { role:['panel','input'] })

	this.react(1, keycode.PAGE_UP, 
		this.output.scrollHistory.bind(this.output), { arg: 'up', role: ['input', 'output'] })
	this.react(1, keycode.PAGE_DOWN, 
		this.output.scrollHistory.bind(this.output), { arg: 'down', role:['input','output'] })
	this.react(100, keycode.END, 
		this.output.scrollHistory.bind(this.output), { arg: 'home', role:['input','output'] })
	this.react(101, keycode['o'], 
		this.output.fitSize.bind(this.output), { arg: 'home', role:['panel', 'input','output'] })
	this.react(100, keycode['r'], this.reloadPanel, { role: ['panel'] })
	this.react(100, keycode['p'], this.hidePanel, { role: ['panel'] })
	this.react(100, keycode['u'], this.swapPanels, { role: ['panel', 'input'] })
	this.react(100, keycode['['], this.dropPath, {arg:'left',role:['panel','input']})
	this.react(100, keycode[']'], this.dropPath, {arg:'right',role:['panel','input']})
	this.react(101, keycode.INSERT, this.copyFullPath, { role:['panel','input'] })
	this.shortcuts.enable('all', false)
	this.shortcuts.enable('panel', true)
}

TNorton.can.keyChooser = function(arg) {
	if (this.input.getText().length > 0)
		this.input.handleCursorKey(arg)
	else if (this.actor == this.left || this.actor == this.right)
		this.actor.list.moveCursor(arg)

	return true
}

TNorton.can.copyFullPath = function() {
	var s, list
	if (this.actor == this.left) list = this.left.list
	else list = this.right.list
	s = list.items[list.sid].name
	if (s) s = list.path + '/' + s; else s = list.path
	clipboardSet(s)
}

TNorton.can.dropPath = function(arg) {
	var s
	if (arg == 'left') s = this.left.list.path
	else s = this.right.list.path
	this.input.setText(this.input.getText() + s + ' ')
	this.input.sel.clear()
	this.repaint()
	return true
}

TNorton.can.swapPanels = function () {
	var swap = function(list, a, b) {
		for (i in list) { var n = list[i], tmp = a[n]; a[n] = b[n]; b[n] = tmp }
	}
	swap(['x', 'y', 'w', 'h'], this.right, this.left)
	// помни: они могут быть разного размера
	this.repaint()
}

TNorton.can.hidePanel = function () {
	if (this.actor == this.left) { 
		if (this.right.visible()) this.hide(this.right); 
		else this.show(this.right)
	}
	if (this.actor == this.right) {
		if (this.left.visible()) this.hide(this.left); 
		else this.show(this.left)
	}
	this.repaint()
}

TNorton.can.reloadPanel = function() {
log('ctrl r')
	if (this.actor == this.left || this.actor == this.right) {
		log('reloadin')
		this.actor.list.reload()
		this.actor.list.onItem(this.actor.list.sid)
		this.repaint()
	}
	return true
}

TNorton.can.smartBackSpace = function() {
	if (this.input.getText() != '') {
		this.input.commandDeleteBack()
		delete this.blockBackspaceUpLevel
		this.blockBackspaceUpLevel = setTimeout(function() {
			delete this.blockBackspaceUpLevel
		}.bind(this), 2000)
	}
	else {
		if (this.blockBackspaceUpLevel) return true
		if (this.actor == this.left || this.actor == this.right)
			this.actor.list.goUpLevel()
	}
	return true
}

TNorton.can.panelsResize = function(arg) {
	if (arg == 'up') this.panelReduce++
	if (arg == 'down') this.panelReduce--
	if (this.panelReduce < 0) this.panelReduce = 0
	if (this.panelReduce > this.h >> 1) this.panelReduce = this.h >> 1
	var W = this.w >> 1, H = this.h - 1
	if (this.input.visible() != true) H++
	this.left.size(W, H - this.panelReduce);
	this.right.size(this.w-W, H - this.panelReduce);
	return true
}

TNorton.can.showKeyCode = function() {
	var keyCode = TKeyCode.create()
	this.getDesktop().showModal(keyCode)
}

TNorton.can.test = function() {
}

TNorton.can.escape =  function() {
	if (this.input.getText().length > 0) this.input.setText(''); else this.outputFlip()
	return true
}


TNorton.can.inputEdit = function(arg) {
	if (this.actor == this.left || this.actor == this.right) {
		if (arg == 'back') return this.input.commandBack()
		if (arg == 'backword') return this.input.commandBackWord()
	}
}

TNorton.can.pressAppendFocusedName = function() {
	var list = this.left.list
	if (this.actor == this.right) list = this.right.list
	var s = list.items[list.sid].name
	if (s == '..') s = list.path
	this.input.setText(this.input.getText() + s + ' ')
	this.input.sel.clear()
	return true
}

fs.readFile(expandPath('~/.deodar/command_history.js'),
function(err, data) {
	if(err != undefined) commandHistory = []
	else commandHistory = eval(data.toString())
})
TNorton.can.historyNavigate = function(arg) {
	var L = commandHistory.list
	if (L == undefined) return
	if (arg == 'up') {
		var s = L.pop()
		if (s == this.input.getText()) L.unshift(s), s = L.pop()
		L.unshift(s)
	} else if (arg == 'down') {
		var s = L.shift()
		if (s == this.input.getText()) L.push(s), s = L.shift()
		L.push(s)
	}
	this.input.setText(s)
	this.input.sel.clear()
	return true
}

TNorton.can.checkFocus = function(view) {
	if  (view == this.input) {
		return ((this.actor == view || this.actor == this.left || this.actor == this.right) && this.getDesktop().modal == undefined)
	}
	return dnaof(this, view)
}
TNorton.can.switchPanel = function() {
	this.left.list.showFocused = false // TODO: move to onFocus
	this.right.list.showFocused = false // это чтобы видеть что удаляешь
	if (this.actor == this.left) this.actor = this.right; else this.actor = this.left
	this.updateInputLabel()
	return true
}

TNorton.can.updateInputLabel = function() {
	var w = 20
	if (this.w) w = this.w / 3
	var s = pathCompress(this.actor.list.path, w)
	this.setLabel(s)
}
TNorton.can.driveMenu = function(which) {
	if (which == 'left') panel = this.left
	if (which == 'right') panel = this.right
	this.actor = panel
	showDriveMenu(this.getDesktop(), panel)
	return true
}
TNorton.can.getOpposite = function(panel) {
	if (panel == this.right) return this.left
	if (panel == this.left) return this.right
}

TNorton.can.setLabel = function(s) {
	this.label.title = s + '>'
	this.label.size(this.label.title.length, 1)
	this.input.pos(this.label.w, this.input.y)
	this.input.size(this.w - this.label.w, 1)
}

TNorton.can.size = function(w, h) {
	dnaof(this, w, h)
	var W = w >> 1, H = h - 1, outmode = false
	if (this.output.working()) outmode = true
	this.output.pos(0, 0)
	this.output.size(w, outmode ? h : h-1)
	this.left.pos(0, 0);
	if (outmode) H++
	this.left.size(W, H - this.panelReduce);
	this.right.pos(W, 0)
	this.right.size(w-W, H - this.panelReduce);
	this.label.pos(0, H)
	this.label.size(this.label.title.length, 1)
	this.input.pos(this.label.w, H)
	this.input.size(w - this.label.w, 1)
	if (this.viewer != undefined) this.viewer.size(w, h)
}

TNorton.can.cwd = function() {
	if (this.actor == this.right) return this.right.list.path
	return this.left.list.path
}

function visibleChar(c) {
	c = c.charCodeAt(0)
	if (c < 32) return false
	return true
}

TNorton.can.onKey = function (K) {
	if (this.actor == this.right || this.actor == this.left) {
		if (K.char != undefined && K.mod.control == false
			&& K.key != keycode.NUM_PLUS && K.key != keycode.NUM_MINUS
			&& K.mod.alt == false && visibleChar(K.char) && this.input.visible()) {
			return this.input.onKey(K)
		}
	}
	return dnaof(this, K)
}

TNorton.can.historyAdd = function(text) {
	if (commandHistory.list == undefined) commandHistory.list = []
	var L = commandHistory.list
	var j = L.indexOf(text); if (j >= 0) L.splice(j, 1)
	L.push(text)
//		saveCommandHistory()
//		fs.writeFileSync(expandPath('~/.deodar/command_history.js'),  
//			'commandHistory=' + JSON.stringify(commandHistory,0, ' '))
}

TNorton.can.runInBackground = function() {
	var s = this.input.getText()
	if (s.length > 0) {
		this.historyAdd(s)
		this.input.setText('')
		try {
			var prog = require('child_process').spawn(s)
			prog.on('error', function() { log('child error') })
		} catch (e) {
			messageBox(this.getDesktop(), 'Ошибка запуска: ' + e.toString())
		}
	}
	return true
}

TNorton.can.pressEnter = function() {
	var s = this.input.getText()
	if (s.length > 0) {
		this.historyAdd(s)
		this.input.setText('')
		var me = this
		if (s.charAt(0) == ' ') {
			return true
		} else setTimeout(function() { 
			me.execute(s) 
		}, 10)
		return true
	}
}

TNorton.can.onItemEnter = function(list, item) {
	if (list.parent.visible()) {
		if (applyEnterRules) {
			var X = applyEnterRules(item.name)
			if (X) {
				if (X.deodar == true) {
					var src = fs.readFileSync(list.path + '/' + X.name).toString()
					var O = eval(src)
					O(this)
				} else if (X.spawn) {
					spawn(X.spawn, [list.path + '/' + X.name])
					return
				} else if (X.tty) {
					this.historyAdd(X.tty + ' ' + X.name)
					this.execute(X.tty + ' ' + X.name)
					return
				}
			}
		}
		if (item.flags.indexOf('x') >= 0) {
			if (this.input.getText() == '') this.input.setText('./' + item.name);
			this.pressEnter()
		}
	}
}

TNorton.can.execDone = function(command) {
	this.shortcuts.enable('all', false)
	this.shortcuts.enable('input', true)
	this.show(this.input)
	if (this.flip) this.exitOutputMode()
	this.actor = this.preCommandFocus
	if (this.right.list.items.length < 300)//smallDirectorySize) 
		this.right.list.reload()
	if (this.left.list.items.length < 300)//smallDirectorySize) 
		this.left.list.reload()
	// else: может как то пометить в ободке окна что список не 
	// обновлён и человек нажал control-R?
	this.size(this.w, this.h)
}

TNorton.can.execute = function(command) {
	if (this.output.working()) {
		this.enterOutputMode(true)
		return
	}
	var cwd = this.cwd()
//	var args = command.split(' ')
//	command = args.shift()
//	if (args[args.length - 1] == '') args.pop()
	var me = this
	this.preCommandFocus = this.actor
	this.flip = this.enterOutputMode(true)
	this.repaint()
	this.actor = this.output
//	лучше сделать все эти ресайзы в особом 
//  колбэке (при первых полученых даных с терминала)
//	а то ведь может комманда вобще ничего не выведет на экран
//	а так можно будет просто вызвать size(this.w, this.h)
	this.output.size(this.output.w, this.output.h + 1)
	this.left.size(this.left.w, this.left.h + 1)
	this.right.size(this.right.w, this.right.h + 1)
	this.hide(this.input)
	var f = this.execDone.bind(this)
	this.shortcuts.enable('all', false)
	this.shortcuts.enable('output', true)
	this.output.respawn(command, '', cwd, f)
}

TNorton.can.outputFlip = function() {
	if (this.left.visible() || this.right.visible()) {
		this.enterOutputMode()
	} else {
		this.exitOutputMode()
	}
	return true
}

TNorton.can.enterOutputMode = function(focusConsole) {
	this.actor_before_output = this.actor
	if (!this.left.visible() && !this.right.visible()) {
		return false
	}
	this.left_was_visible = this.left.visible()
	this.right_was_visible = this.right.visible()
	if (this.left.visible() || this.right.visible())
		this.hide(this.right), this.hide(this.left);
	this.shortcuts.enable('all', false)
	if (this.output.working() || focusConsole) {
		this.shortcuts.enable('output', true)
		this.actor = this.output
	} else {
		this.shortcuts.enable('input', true)
	}
	return true
}
TNorton.can.exitOutputMode = function() {
	this.shortcuts.enable('all', false)
	this.shortcuts.enable('panel', true)
//	this.shortcuts.enable('input', true)
	this.actor = this.actor_before_output
	if(this.actor != this.left && this.actor != this.right) this.actor = this.left
	if (this.left_was_visible) this.show(this.left)
	if (this.right_was_visible) this.show(this.right)
	this.getDesktop().display.caretReset()
}

TNorton.can.viewFileName = function(viewClass, name) {
	var colors = getColor[theme.viewer]
	require('./intervision/palette')
	if (viewClass === TFileEdit) colors = getColor[theme.editor]
	if (viewClass === TTextView) colors = getColor[theme.viewer]
	this.viewer = viewFile(this.getDesktop(), name, viewClass, colors)
	return true
}

TNorton.can.viewFile = function(viewClass) {
	if (this.actor == this.left || this.actor == this.right) {
		with (this.actor.list) {
			var panel = this.actor
			if (items[sid].dir == false && items[sid].hint != true) {
				// сделай isFile()
				this.viewFileName(viewClass, path + '/' + items[sid].name)
				if (this.viewer) {
					this.viewer.onHide = function() {
						panel.list.reload()
					}
				}
			} else log('not a file')
		}
	}
}

TNorton.can.editNew = function() {
	this.viewFile(TFileEdit)
}

TNorton.can.editFileInput = function() {
	if (this.actor == this.left || this.actor == this.right)
		promptEditFile(this.actor, this.editNew.bind(this))
	return true
}

TNorton.can.commandMakeDir = function() {
	if (this.actor == this.left || this.actor == this.right)
		promptMakeDir(this.actor)
	return true
}

TNorton.can.commandDelete = function() {
	if (this.actor == this.left || this.actor == this.right) {
		this.actor.list.showFocused = true
		promptDeleteFile(this.actor)
	}
	return true
}

TNorton.can.commandCopy = function(arg) {
	if (this.actor == this.left || this.actor == this.right) {
		var dest = this.left
		if (this.actor == this.left) dest = this.right
		promptCopyFile(arg, this.actor, dest)
	}
	return true
}

editFileAlt = function(s) {
	glxwin.sh_async('pluma '+ s)
}

