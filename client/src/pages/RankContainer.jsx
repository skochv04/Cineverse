import React from 'react';
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const RankContainer = ({rank}) => {
    const percentage = rank * 10;

    return (
        <div id="rank_container" style={{width: 70, height: 70}}>
            <CircularProgressbar
                value={percentage}
                text={rank.toFixed(1)}
                styles={buildStyles({
                    textColor: "#fff",
                    pathColor: "green",
                    trailColor: "#d6d6d6",
                })}
            />
        </div>
    );
};

export default RankContainer;