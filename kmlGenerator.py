#!/usr/bin/env python

import csv # imports the csv module
import collections #imports the collections modules
from lxml import etree # imports lxml module for creating xml files

# routesFile = "MBTA_GTFS/routes.txt"
# tripsFile = "MBTA_GTFS/trips.txt"
# shapesFile = "MBTA_GTFS/shapes.txt"

#GTFS files 
routesFile = raw_input("Enter a path for the routes file: ")
tripsFile = raw_input("Enter a path for the trips file: ")
shapesFile = raw_input("Enter a path for the shapes file: ")

#Gets all the shape id's from the trips file for a particular route.
def getShapeIds(tripsFile, currentRoute):
	shapes = []
	tripsRowCount = 1
	i = 0
	with open(tripsFile, "rb") as t:
		tripsReader = csv.reader(t)
		for tripsRow in tripsReader:
			if tripsRowCount > 1:
				tripsRouteId =  tripsRow[0]
				tripsShapeId = tripsRow[7]
				tripsHeadSign = tripsRow[3]
				if currentRoute == tripsRouteId:
					if tripsShapeId not in shapes:
						shapes.append(tripsShapeId)

			tripsRowCount += 1

	return shapes

#Find all of the coordinates for a particular shape id.
def findCoordinates(shapeId):
	result = []
	shapesRowCount = 1
	with open(shapesFile, "rb") as s:
		shapesReader = csv.reader(s)
		for shapesRow in shapesReader:
			items = {"lat": None, "lon": None}
			if shapesRowCount > 1:
				currentShapeId = shapesRow[0]
				if currentShapeId == shapeId:
					items["lat"] = shapesRow[1]
					items["lon"] = shapesRow[2]
					result.append(items)
			shapesRowCount += 1
	return result


#Write the xml to the kml file for a particular route.
def writeFiles(currentRoute, shapeIds, kmlFile):
	print("Inside writeFiles function.")
	print("currentRoute: " + currentRoute) #Show current route for status update.
	result = ""

	root = etree.Element("kml")
	root.set("xmlns", "http://www.opengis.net/kml/2.2")
	document = etree.SubElement(root, "Document")
	style = etree.SubElement(document, "Style")
	style.set("id", "transBluePoly")
	lineStyle = etree.SubElement(style,"LineStyle")
	etree.SubElement(lineStyle, "width").text = "1.5"
	polyStyle = etree.SubElement(style, "PolyStyle")
	etree.SubElement(polyStyle, "color").text = "7dff0000"
	folder  = etree.SubElement(document, "Folder")
	etree.SubElement(folder, "name").text = currentRoute
	etree.SubElement(folder, "description").text = "Coordinates for route " + currentRoute

	# Find coordinates for a route shape id.
	for shape in shapeIds:
		coords = []
		coordsString = "\n"		
		
		coords = findCoordinates(shape)
		
		for coord in coords:
			coordsString += coord["lon"] + "," + coord["lat"] + ",0.000000\n"		
		
		placeMark = etree.SubElement(folder, "Placemark")
		etree.SubElement(placeMark, "name").text = "Current shape id: " + shape
		etree.SubElement(placeMark, "styleUrl").text = "#transBluePoly"
		etree.SubElement(placeMark, "description").text = "Coordinates for " + shape + " shape id."
		etree.SubElement(placeMark, "visibility").text = "1"
		lineString = etree.SubElement(placeMark, "LineString")
		extrude = etree.SubElement(lineString, "extrude").text = "0"
		tessellate = etree.SubElement(lineString, "tessellate").text = "1"
		altitudeMode = etree.SubElement(lineString, "altitudeMode").text = "clampToGround"
		coordinates = etree.SubElement(lineString, "coordinates")	
		coordinates.text = coordsString


	tree = etree.ElementTree(root)

	tree.write(kmlFile, pretty_print=True, xml_declaration=True , encoding="UTF-8", method="xml")


# Create the new kml files.
def createFiles(matchedIds):
	data = matchedIds["data"]
	for a in data:
		currentRoute = a["routeId"]
		shapeIds = a["shapeIds"]
		kmlFile = open("kml/" + currentRoute.lower() + ".kml", "w+")
		writeFiles(currentRoute, shapeIds, kmlFile)


# Main funciton to begin.
matchedIds = {"data": []} # Matched shape ids with routes.
routesRowCount = 1 # Counter for routes file row.

# Read routes from routes file into array.
with open(routesFile, "rb") as r:
 	routesReader = csv.reader(r)
 	for routesRow in routesReader:
 		currentRoute = routesRow[0]
 		if currentRoute != "route_id" :
 			print("currentRoute: " + currentRoute) # Show current route that's being processed.
	 		items = {}
	 		shapeIds = getShapeIds(tripsFile, currentRoute) 
	 		items = {"routeId": None, "shapeIds": None}
	 		items["shapeIds"] = shapeIds
	 		items["routeId"] = currentRoute
			matchedIds["data"].append(items)
			routesRowCount += 1

print("Finished processing now creating KML files.")

createFiles(matchedIds)

