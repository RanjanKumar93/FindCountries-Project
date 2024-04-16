import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((res) => {
        setCountry([...res.data, ...country]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  let countryName = [];

  for (let i = 0; i < country.length; i++) {
    countryName.push(country[i].name.common);
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setFiltered((prev) => [
      ...countryName.filter((x) =>
        x.toLowerCase().includes(search.toLocaleLowerCase())
      ),
    ]);
  };

  function showCountryHandler(country) {
    setSearch(country);
    setFiltered((prev) => [
      ...countryName.filter((x) => x.toLowerCase() === country.toLowerCase()),
    ]);
  }

  let outputData;
  if (search.length === 0) {
    outputData = null;
  } else if (filtered.length > 10) {
    outputData = <p>Too many matches, specify another filter</p>;
  } else if (filtered.length > 1) {
    outputData = filtered.map((country, index) => (
      <p style={{ marginBottom: "-15px" }} key={index}>
        {country}{" "}
        <button onClick={() => showCountryHandler(country)}>show</button>
      </p>
    ));
  } else if (filtered.length === 1) {
    const { png, alt } = country[countryName.indexOf(filtered[0])].flags;
    const myArr = Object.entries(
      country[countryName.indexOf(filtered[0])].languages
    );
    outputData = (
      <>
        <div style={{ marginBottom: "-8px" }}>
          <h2>{filtered}</h2>
        </div>
        <div style={{ marginBottom: "-8px" }}>
          <p style={{ marginBottom: "-15px" }}>
            capital {country[countryName.indexOf(filtered[0])].capital}
          </p>
          <p>area {country[countryName.indexOf(filtered[0])].area}</p>
        </div>
        <div style={{ marginBottom: "-8px" }}>
          <h3>languages:</h3>
        </div>
        <div>
          <ul>
            {myArr.map((lang, index) => (
              <li key={index}>{lang[1]}</li>
            ))}
          </ul>
        </div>
        <div>
          <img src={png} alt={alt} />
        </div>
      </>
    );
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ margin: "3px" }}>
      <div style={{ marginBottom: "-8px" }}>
        find countries{" "}
        <input type="text" value={search} onChange={handleSearchChange} />
      </div>
      <div>{outputData}</div>
    </div>
  );
}

export default App;
