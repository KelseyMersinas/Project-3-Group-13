from flask import Flask, render_template
import sqlite3



app = Flask(__name__)

@app.route("/<chart_name>")
def main_handler(chart_name):
    js_targets = {
        "mass_distribution": "heatmap_mass_distribution.js"
    }
    return  render_template("index.html", chart_js=js_targets.get(chart_name, "noop.js"))

@app.route("/api/v1/mass_distribution")
def mass_distribution_api():
    conn = sqlite3.connect('meteorite-landings.sqlite')
    cur = conn.cursor()
    cur.execute("SELECT id, mass, lat, long FROM [meteorite-landings]")
    rows = cur.fetchall()

    return rows

if __name__ == "__main__":
    app.run(debug=True)
    