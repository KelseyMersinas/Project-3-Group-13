from flask import Flask, render_template, jsonify, request
from sqlHelper import init_db, MeteoriteLanding

app = Flask(__name__)

# Configure SQLAlchemy with SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///meteorite-landings.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database connection and create tables
db_session = init_db(app)

@app.route('/', methods=['GET'])
def landing():
    return render_template('index.html')

@app.route('/heatmap', methods=['GET'])
def heatmap():
    return render_template('heatmap.html')

@app.route('/graph', methods=['GET'])
def graph():
    return render_template('graph.html')

@app.route('/workscited', methods=['GET'])
def workscited():
    return render_template('workscited.html')

@app.route('/aboutus', methods=['GET'])
def aboutus():
    return render_template('aboutus.html')

@app.route('/api/v1/data', methods=['GET'])
def get_data():
    session = db_session()
    data = session.query(MeteoriteLanding).all()
    db_session.remove()  # Ensure the session is removed when done
    return jsonify([{
        "id": row.id,
        "name": row.name,
        "mass": row.mass,
        "year": row.year,
        "lat": row.lat,
        "long": row.long,
        "GeoLocation": row.GeoLocation
    } for row in data])

@app.route("/<chart_name>")
def main_handler(chart_name):
    js_targets = {
        "mass_distribution": "heatmap_mass_distribution.js"
    }
    return render_template("index.html", chart_js=js_targets.get(chart_name, "noop.js"))

@app.route("/api/v1/mass_distribution")
def mass_distribution_api():
    session = db_session()
    data = session.query(MeteoriteLanding.id, MeteoriteLanding.mass, MeteoriteLanding.lat, MeteoriteLanding.long).all()
    session.remove()  # Ensure the session is removed when done
    return jsonify([{
        "id": row.id,
        "mass": row.mass,
        "lat": row.lat,
        "long": row.long
    } for row in data])

if __name__ == "__main__":
    app.run(debug=True)  