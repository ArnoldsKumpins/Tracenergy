import requests

class PVCalculator:
    def __init__(self, lat: float, lon: float, peakpower: float, loss: float, angle: float, aspect: float):
        """
        Initialize the PVCalculator with the given parameters.
        :param lat: Latitude in decimal degrees.
        :param lon: Longitude in decimal degrees.
        :param peakpower: Nominal power of the PV system (kWp).
        :param loss: System losses in percentage.
        :param angle: Slope angle of the PV panels (degrees).
        :param aspect: Orientation (azimuth) of the panels (degrees).
        """
        self.lat = lat
        self.lon = lon
        self.peakpower = peakpower
        self.loss = loss
        self.angle = angle
        self.aspect = aspect

    def fetch_data(self):
        """
        Fetch the PV energy production data from the API.
        :return: A list of monthly energy production values (E_m), with the last element being the yearly total.
        """
        base_url = f"https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat={self.lat}&lon={self.lon}&peakpower={self.peakpower}&loss={self.loss}&angle={self.angle}&aspect={self.aspect}"
        
        response = requests.get(base_url)
        data = response.text

        monthly_energy = []

        if "Month" in data:
            lines = data.splitlines()
            yearly_total = 0
            for line in lines:
                if line.strip() and line[0].isdigit():  # Check if the line starts with a digit (i.e., month)
                    month_data = line.split()
                    e_m = float(month_data[2])  # E_m is the third value in the line
                    yearly_total += e_m
                    monthly_energy.append(e_m)

            # Append the yearly total as the last element
            monthly_energy.append(round(yearly_total, 2))
        else:
            raise ValueError("Monthly data not found in the response")

        return monthly_energy

    def print_energy_values(self, energy_values):
        """
        Print the monthly energy values followed by the yearly total.
        :param energy_values: List of monthly energy values with the yearly total as the last element.
        """
        for i, e_m in enumerate(energy_values[:-1], start=1):
            print(f"Month {i}: {e_m} kWh")
        print(f"Yearly total: {energy_values[-1]} kWh")
