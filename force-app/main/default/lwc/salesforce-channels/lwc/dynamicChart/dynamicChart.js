import { LightningElement, api, track } from 'lwc';
import myNewFeatureFlag from '@salesforce/featureFlag/Content.org.myNewFeatureGate';

export default class DynamicChart extends LightningElement {
    @api chartType = 'bar'; // Default chart type
    @api chartData = [];
    @api chartTitle = 'Chart';
    @api useDynamicComponent = false; // Flag to choose between dynamic and static component

    @track chartConstructor;
    @track isLoading = true;
    @track error;
    _currentChartType = 'bar';

    connectedCallback() {
        this._currentChartType = this.chartType;
        this.loadChartComponent();
    }

    get isFeatureFlagEnabled() {
        return myNewFeatureFlag;
    }

    async loadChartComponent() {
        if (!this.isFeatureFlagEnabled) {
            return;
        }
        try {
            this.isLoading = true;
            this.error = null;

            // Dynamic import from lightning namespace - using statically analyzable imports
            let module;
            switch (this._currentChartType) {
                case 'bar':
                    module = await import('lightning/barChart');
                    break;
                case 'pie':
                    module = await import('lightning/pieChart');
                    break;
                case 'line':
                    module = await import('lightning/lineChart');
                    break;
                default:
                    throw new Error(
                        `Unsupported chart type: ${this._currentChartType}`
                    );
            }
            this.chartConstructor = module.default;
        } catch (err) {
            this.error = `Failed to load ${this._currentChartType} chart component: ${err.message}`;
            console.error('Error loading dynamic component:', err);
        } finally {
            this.isLoading = false;
        }
    }

    // Method to change chart type dynamically
    @api
    changeChartType(newType) {
        this._currentChartType = newType;
        if (this.useDynamicComponent) {
            this.loadChartComponent();
        }
    }

    // Event handlers for chart type buttons
    handleBarChart() {
        this.changeChartType('bar');
    }

    handlePieChart() {
        this.changeChartType('pie');
    }

    handleLineChart() {
        this.changeChartType('line');
    }

    // Getters for button classes
    get barButtonClass() {
        return this._currentChartType === 'bar' ? 'slds-button_brand' : '';
    }

    get pieButtonClass() {
        return this._currentChartType === 'pie' ? 'slds-button_brand' : '';
    }

    get lineButtonClass() {
        return this._currentChartType === 'line' ? 'slds-button_brand' : '';
    }

    // Getter for child component properties
    get childProps() {
        return {
            data: this.chartData,
            title: this.chartTitle,
            type: this._currentChartType
        };
    }

    // Getter to check if dynamic chart constructor is available
    get isDynamicChartAvailable() {
        return this.useDynamicComponent && this.chartConstructor;
    }

    // Getter to check if static chart should be used
    get useStaticChart() {
        return !this.useDynamicComponent;
    }
}
