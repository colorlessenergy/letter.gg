import React from 'react';
import { Link } from 'react-router-dom'


const BuildList = (props) => {
  let { builds } = props;
  return builds ? (
    builds.map((build, index) => {
      console.log(build);
      let championIcon = require(`../../assets/champion-icons/${build.champion}.png`)
      return (
        <Link to={props.url + build.id} key={index}>
          <section>
            <h2>[{build.champion}] - {build.title}</h2>
            <img src={championIcon} alt={build.champion} />
            {build.items.map((item) => {
              let itemIcon = require(`../../assets/item-icons/${item}.png`);
              return <img src={itemIcon} alt={item} key={item} />
            })}

            {build.comp.map((champion) => {
              let championIcon = require(`../../assets/champion-icons/${champion}.png`);
              return <img src={championIcon} alt={champion} key={champion} />
            })}
          </section>
        </Link>
      )
    })
  ) : (
      <p>no builds</p>
    );
}

export default BuildList