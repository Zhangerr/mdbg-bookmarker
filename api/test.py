#!flask/bin/python2.7
# -*- coding: utf-8 -*-
import gspread
import sys
import json
from flask import Flask, jsonify,request
import traceback
gc = gspread.login('test','password')

wks = gc.open('test').sheet1



app = Flask(__name__)
key = wks.col_values(1)
i = 0

@app.route('/words',methods=['GET'])
def get_words():
    return json.dumps(wks.col_values(1))
@app.route('/check',methods=['POST'])
def check():
	#global i
	#i += 1
	#return str(i)
	resp = []
	for i in request.get_json(force=True)['title']:
		if i in key:
			resp.append(True)
		else:
			resp.append(False)
	return json.dumps(resp)			

@app.route('/words',methods=['POST'])
def add_word():    
	#for i in request.values:
#		print i
	try:
		jso = request.get_json(force=True)
		js = jso['title']
		if jso['pw'] == 'ZoFyi0/TYqwP77':
			key.append(js[0])			
			wks.append_row(js)
	except:
		print sys.exc_info()[0]
		traceback.print_exc()
	#	return sys.exc_info()[0]
	return '{"message":"success"}'
@app.route('/words/<int:id>',methods=['GET'])
def get_word(id):
	try:
		return wks.col_values(1)[id]
	except:
		return "{'error':'undefined index'}"

if __name__ == '__main__':
    app.run(debug = True,host='0.0.0.0',port=80)    
