import React from 'react';
import { Link } from 'react-router-dom'
import classes from './BuildList.module.css';

/**
  takes in an array of data that is used to create
  JSX to display builds to a user
  
  @param {Array} builds - An array of objects with information about a build/guide
    Each property in the object
    @param {String} builds.authorId - authorId: "WpP4d90c5pTxh3ZPUdQ1O6TB8Tv2"
    @param {String} builds.champion - champion: "Braum"
    @param {Array} builds.comp - comp: (2) ["Darius", "Graves"]
    @param {String} builds.content - content: "Braum is good"
    @param {Object} builds.createdAt - createdAt: Timestamp {seconds: 1562519078, nanoseconds: 930000000}
    @param {String} builds.creator - creator: "22@gmail.com"
    @param {String} builds.id - id: "JWCVdEumOynKelhkxBh4"
    @param {Array} builds.items - items: (3) ["guinsoosrageblade", "spearofshojin", "spearofshojin"]
    @param {String} builds.title - title: "graves"
  @param {String} url - a string to prepend to each build link
  @param {String} class - a string to append to each list
 */

const BuildList = (props) => {
  let { builds } = props;
  let buildsList = null;
  if (builds) {
    buildsList = (
      <div className={classes["builds-container"]}>
        {builds.map((build, index) => {
          console.log(build);

          console.log(build.createdAt.seconds);
          let date = new Date(build.createdAt.seconds * 1000);
          let dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
          date = date.toLocaleDateString('en-US', dateOptions)
          console.log(date);

          let titleWords = build.title.split('');
          let filteredWords = null;
          console.log(titleWords);
          console.log(titleWords.length);
          if (titleWords.length >= 21) {
            filteredWords = titleWords.slice(0, 22);
            console.log(filteredWords);
            filteredWords = filteredWords.join('') + '...';
          }
          let title = titleWords.join('');
          console.log(title);
          let newTitle = filteredWords ? filteredWords : title;
          console.log(newTitle);

          let championIcon = require(`../../assets/champion-icons/${build.champion}.png`);
          
          return (
            <Link to={props.url + build.id} key={index} className={[classes['build'], classes['link']].join(' ')}>
            <section>
              <div className={classes['build__flex--horizontal']}>
                <div className={classes['build__champion']}>
                  <img src={championIcon} alt={build.champion} />
                </div>
                <div className={classes['build__flex--vertical']}>
                    <h2 className={classes['build__title']}>[{build.champion}]<span className={classes['font--normal']}> - {date} - {build.upvotes} likes - {newTitle}</span></h2>
                  <div className={classes['build__items']}>
                    {build.items.map((item) => {
                      let itemIcon = require(`../../assets/item-icons/${item}.png`);
                      return <img src={itemIcon} alt={item} key={item} className={classes['build__item']}/>
                    })}
                  </div>
                </div>
              </div>
            </section>
          </Link>
          );
        })}
      </div>
    )
  }
  else {
    buildsList = (
      <div className={classes['no-builds-container']}>
        <p>No Builds</p>
      </div>
    );
  }

  return buildsList;
}

export default BuildList
