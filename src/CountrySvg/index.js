import React, { Component } from 'react';
import PropTypes from 'prop-types';
import geojson2svg from 'geojson-to-svg';
// import { getBoundaries } from '../utils/geojsonUtils';
import merc from 'mercator-projection';

import './style.css';

class CountrySvg extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            svg: null
        };
        this.svgRef = React.createRef();
        this.initSvg = this.initSvg.bind(this);
    }

    componentDidMount() {
        setTimeout(this.initSvg);
    }

    render() {
        return (
            <div className='CountrySvg'>
                {
                    this.state.loading &&
                    <div> Loading... </div>
                }
                <div className='CountrySvg-inner'>
                    {
                        this.state.svg &&
                        <div dangerouslySetInnerHTML={this.state.svg}
                            ref={this.svgRef}
                        ></div>
                    }
                    {
                        this.canShowDot() &&
                        <div
                            className='CountrySvg-dot'
                            style={this.getDotStyle()}>
                            {
                                `Lat ${this.props.latLonToProject.lat}, Lon: ${this.props.latLonToProject.lon}`
                            }
                        </div>

                    }
                </div>
            </div>
        );
    }

    initSvg() {
        const svgElement = this.getSvgElement();
        makeSvgElementSquare(svgElement);
        this.setState({
            loading: false,
            svg: {
                __html: svgElement.outerHTML
            }
        });
    }

    canShowDot() {
        const result = this.props.latLonToProject && this.props.countryInfo && this.svgRef.current;
        return result;
    }

    getDotStyle() {
        const pixelInfo = project(
            this.props.latLonToProject,
            getSvgBoundaries(this.svgRef.current.querySelector('svg')),
            this.svgRef.current.getBoundingClientRect(),
        );
        return {
            top: `${pixelInfo.y}px`,
            left: `${pixelInfo.x}px`,
        };
    }

    getSvgElement() {
        const svg = geojson2svg()
            .styles({ 'MultiPolygon' : { fill: 'black', stroke: 'none' } })
            .projection((coord) => {
                const projected = merc.fromLatLngToPoint({lat: coord[1], lng: coord[0]});
                return [projected.x, projected.y];
            })
            .data(this.props.countryInfo)
            .render();

        const parser = new DOMParser();
        return parser.parseFromString(svg, "image/svg+xml").querySelector('svg');
    }
}

function project(latlon, svgBoundaries, boundingBox) {
    const { minX, minY, maxX, maxY } = svgBoundaries;
    const {x, y} = merc.fromLatLngToPoint({lat: latlon.lat, lng: latlon.lon});
    const relativeX = getRelativePosition(x, minX, maxX);
    const relativeY = getRelativePosition(y, minY, maxY);
    return {
        x: relativeX * boundingBox.width,
        y: relativeY * boundingBox.height,
    };

}

function getSvgBoundaries(element) {
    const viewBox = element.getAttribute('viewBox');
    const [minX, minY, width, height] = viewBox.split(' ').map(string => parseFloat(string));

    return {
        minX,
        minY,
        maxX: minX + width,
        maxY: minY + height
    };
}

function getRelativePosition(x, min, max) {
    return (x - min) / (max - min);
}

function makeSvgElementSquare(element) {

    const viewBox = element.getAttribute('viewBox');
    let [minX, minY, width, height] = viewBox.split(' ').map(string => parseFloat(string));

    if(width < height) {
        const diff = height - width;
        minX = minX - (diff / 2);
        width = height;
    } else {
        const diff = width - height;
        minY = minY - (diff / 2);
        height = width;
    }

    element.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);

    return element;
}

CountrySvg.propTypes = {
    countryInfo: PropTypes.object.isRequired,
    latLonToProject: PropTypes.object,
};

export default CountrySvg;
