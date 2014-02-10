//mass update button key shortcut, shift click checkbox selection
//scroll to bottom function
/*jQuery extension for selecting text*/
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

jQuery.fn.selectText = function(){
    var doc = document
        , element = this[0]
        , range, selection
    ;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};
//todo:client sends list of hanzi, server compares with inmemory cache (app startup load from spreadhseet, then subsequent inserts go to memory) and replies with booleans thats used for crossreference
//easier method: just go by url, then dont even need array, but then miss the ability for specific phrases compared to current

//hanzi, pinyin, def, url to single entry, source url (location.href or w/e)

var toSend = {title:[]}
$('.row').each(function() {
	toSend.title.push($('.hanzi',$(this)).first().text()) //some rows have two instances of .hanzi, one for trad one for simp
})

$.ajax({
	url:'http://vps.zhanger.us/check',
	type:'POST',
	data:JSON.stringify(toSend),
	contentType:'application/json; charset=utf-8',
	dataType:"json",
	success:function(data){
		$('.row').each(
			function(index) {
				if(data[index]) {
					$('.e',$(this)).prepend('<a>BMED</a>');
				} else {
					$('.e',$(this)).prepend('<a class="mdbgbm" href="#" data-kanji="{0}" data-pinyin="{1}" data-def="{2}">BM</a>'.format(
						$('.hanzi',$(this)).first().text(),
						$('.pinyin span',$(this)).map(function() {
								return $(this).text();
						}).get().join(' '),
						$('.defs',$(this)).text()
					));
				}				
			}
		)
		console.log(data)
		$('.mdbgbm').click(function(e) {
			e.preventDefault();
			var submit = {title:[$(this).attr('data-kanji'),$(this).attr('data-pinyin'),$(this).attr('data-def'),location.href],pw:"ZoFyi0/TYqwP77"}
			$.ajax({url:'http://vps.zhanger.us/words',type:'POST',data:JSON.stringify(submit),contentType:'application/json; charset=utf-8',dataType:"json",success:function(data){console.log(data)}})
			$(this).text('BMED')
			$(this).unbind()
		})
}})