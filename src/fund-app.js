import { LitElement, html, css,  } from 'lit-element';

class FundApp extends LitElement {
  static get properties() {
    return {
      data: Array,
      filteredData: Array,
      maximumAmount: Number,
      minimumAmount: Number,
      selectedMinAmount: Number,
      selectedMaxAmount: Number,
      sectors: Array,
      filteredSectors: Array,
      contentReady: Boolean,
    };
  }

  constructor() {
    super();
    this.contentReady = false;
    this.sectors = [];
    this.filteredSectors = [];
    fetch('mock-data.json')
      .then(r => r.json())
      .then(json => {
        this.data = json;
        this.filteredData = [...json];
        this.maximumAmount = Math.max.apply(Math, this.data.map(function(o) { return parseFloat(o.amount); }));
        this.minimumAmount = Math.min.apply(Math, this.data.map(function(o) { return parseFloat(o.amount); }));

        this.sectors = [...new Set(this.data.map(el => el.sector))];
        this.selectedMaxAmount = this.maximumAmount;
        this.selectedMinAmount = this.minimumAmount;
        this.contentReady = true;
      })
  }

  updated(changedProperties) {
    if(this.contentReady){
      this.addEventListener('updateValues', e => {
        const min = this.shadowRoot.getElementById('slider').valueMin;
        const max = this.shadowRoot.getElementById('slider').valueMax;
        this.selectedMinAmount = min;
        this.selectedMaxAmount = max;
        this._filterSelection('amount');
      });
    }
  }

  _filterSelection(field) {
    if(field === 'amount'){
      this.filteredData = this.data.filter(el => el.amount >= this.selectedMinAmount && el.amount <= this.selectedMaxAmount)
    } else if(field === 'sector') {
      this.filteredData = this.data.filter(el => this.filteredSectors.indexOf(el.sector) !== -1);
    }
  }

  _toggledButton(sector) {
    console.log(' toggled');

    if(this.filteredSectors.indexOf(sector) === -1){
      this.filteredSectors.push(sector)
    } else {
      this.filteredSectors = this.filteredSectors.filter(item => item !== sector)
    }

    this._filterSelection('sector');

  }

  _resetFilters() {
    this.filteredData = this.data;
  }
  render() {
    return html`
    <h1>FILTER POC</h1> <button @click=${this._resetFilters}>Reset filters</button>
    <div class="flex-container">
      <div class="flex-element">
        min: ${this.minimumAmount}
        max: ${this.maximumAmount}
        current range: ${this.selectedMinAmount} - ${this.selectedMaxAmount}
        <paper-range-slider id="slider" min=${this.minimumAmount} max=${this.maximumAmount} value-min=${this.minimumAmount} value-max=${this.maximumAmount}></paper-range-slider>
      </div>
      <div class="sector-div">
        Filter on sector:

        ${this.sectors.map(sector => html`
        <input @click=${e=>this._toggledButton(sector)} class="tgl tgl-skewed" id="cb3${sector}" type="checkbox" />
            <label class="tgl-btn" data-tg-off="${sector}" data-tg-on="${sector}" for="cb3${sector}">
            </label>
      
        
        
        `)}

          
      </div>
    </div>
   
  </div>
      <table>
        <thead>
          <tr>
            <th>
              ISIN
            </th>
            <th>
              Currency
            </th>
            <th>
              Sector
            </th>
            <th>
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          ${this.filteredData && this.filteredData.map(el => 
            html`
            <tr>
              <td>
                ${el.isin}
              </td>
              <td>
                ${el.currency}
              </td>
              <td>
                ${el.sector}
              </td>
              <td>
                ${el.amount}
              </td>
            </tr>
            `
          )}

        </tbody>
      </table>
    `;
  }

  static get styles() {
    return css`

      .flex-container{
        display: flex;
      }

      .flex-element {
        width: 60%
      }
     
     
      .tgl {
        display: none;
     }
      .tgl, .tgl:after, .tgl:before, .tgl *, .tgl *:after, .tgl *:before, .tgl + .tgl-btn {
        box-sizing: border-box;
     }
      .tgl::selection, .tgl:after::selection, .tgl:before::selection, .tgl *::selection, .tgl *:after::selection, .tgl *:before::selection, .tgl + .tgl-btn::selection {
        background: none;
     }
      .tgl + .tgl-btn {
        outline: 0;
        display: block;
        width: 4em;
        height: 2em;
        position: relative;
        cursor: pointer;
        user-select: none;
     }
      .tgl + .tgl-btn:after, .tgl + .tgl-btn:before {
        position: relative;
        display: block;
        content: "";
        width: 50%;
        height: 100%;
     }
      .tgl + .tgl-btn:after {
        left: 0;
     }
      .tgl + .tgl-btn:before {
        display: none;
     }
      .tgl:checked + .tgl-btn:after {
        left: 50%;
     }
      .tgl-skewed + .tgl-btn {
        overflow: hidden;
        transform: skew(-10deg);
        backface-visibility: hidden;
        transition: all 0.2s ease;
        font-family: sans-serif;
        background: #888;
        width: 150px;
        
     }
      .tgl-skewed + .tgl-btn:after, .tgl-skewed + .tgl-btn:before {
        transform: skew(10deg);
        display: inline-block;
        transition: all 0.2s ease;
        width: 100%;
        text-align: center;
        position: absolute;
        line-height: 2em;
        font-weight: bold;
        color: #fff;
        text-shadow: 0 1px 0 rgba(0, 0, 0, .4);
     }
      .tgl-skewed + .tgl-btn:after {
        left: 100%;
        content: attr(data-tg-on);
     }
      .tgl-skewed + .tgl-btn:before {
        left: 0;
        content: attr(data-tg-off);
     }
      .tgl-skewed + .tgl-btn:active {
        background: #888;
     }
      .tgl-skewed + .tgl-btn:active:before {
        left: -10%;
     }
      .tgl-skewed:checked + .tgl-btn {
        background: #86d993;
     }
      .tgl-skewed:checked + .tgl-btn:before {
        left: -100%;
     }
      .tgl-skewed:checked + .tgl-btn:after {
        left: 0;
     }
      .tgl-skewed:checked + .tgl-btn:active:after {
        left: 10%;
     }
     

    
    
    `
  }
}

customElements.define('fund-app', FundApp);