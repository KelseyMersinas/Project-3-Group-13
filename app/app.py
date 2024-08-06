from flask import Flask, render_template

app = Flask(__name__)

@app.route("/<chart_name>")
def main_handler(chart_name):
    js_targets = {
        "mass_distribution": "heatmap_mass_distribution.js"
    }
    return  render_template("index.html", chart_js=js_targets.get(chart_name, "noop.js"))



if __name__ == "__main__":
    app.run(debug=True)
    