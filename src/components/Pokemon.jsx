import { useEffect, useState } from "react";

export default function Pokemon() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState([]);
  const [prevUrl, setPrevUrl] = useState("");
  const [nextUrl, setNextUrl] = useState("");
  const [apiUrl, setApiUrl] = useState("https://pokeapi.co/api/v2/pokemon");

  async function getAllPokemon() {
    const resData = await fetch(apiUrl);
    const jsonData = await resData.json();

    setPrevUrl(jsonData.previous || "");
    setNextUrl(jsonData.next || "");

    let pokemonDetail = [];

    jsonData.results.map(async (item, index) => {
      const resDataDetail = await fetch(item.url);
      const jsonDataDetail = await resDataDetail.json();
      pokemonDetail[index] = jsonDataDetail;
      setPokemonList([...pokemonDetail]);
    });
  }

  function pokemonDetail() {
    return (
      <div className="detail" onClick={() => setDetail(false)}>
        <div className="item">
          <a>x</a>
          <div className="image">
            <img
              src={dataDetail.sprites.other.dream_world.front_default}
              alt=""
            />
          </div>
          <div className="title">{dataDetail.name}</div>
          <div className="abilities">
            {dataDetail.abilities.map((item, index) => {
              return <span key={index}>{item.ability.name}</span>;
            })}
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    getAllPokemon();
    setLoading(false);
  }, [apiUrl]);

  return (
    <div className="wrapper">
      <div className="content">
        {loading && <div className="loading">Loading. . .</div>}
        {detail && pokemonDetail()}
        <div className="grid">
          {pokemonList.map((item, index) => {
            return (
              <div
                className="item"
                key={index}
                onClick={() => {
                  setDetail(true);
                  setDataDetail(item);
                }}
              >
                <div className="image">
                  <img src={item.sprites.front_default} alt="pokeicon" />
                </div>
                <div className="title">{item.name}</div>
              </div>
            );
          })}
        </div>
        {prevUrl && (
          <div className="pagination-left">
            <button
              onClick={() => {
                setApiUrl(prevUrl);
              }}
            >
              &laquo;
            </button>
          </div>
        )}
        {nextUrl && (
          <div className="pagination-right">
            <button
              onClick={() => {
                setApiUrl(nextUrl);
              }}
            >
              &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
