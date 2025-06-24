import { LightningElement, api, track, wire } from 'lwc';
import { RefreshCapability, CapabilityMixin } from 'laf/pageCapability';
import { getRecordLayoutTemplate, getRecordTypeId } from 'laf/templateApi';
import { resolveAdg } from "laf/adgResolver";
import { reduceUiApiWireErrors } from 'force/wireUtils';
import { RecordUiHelpers, RecordUiConstants, markTransactionStart, markTransactionEnd, getInstrumentedObjectNameFromApiName, logError, ReadsMetrics, RecordErrorsLibrary } from "force/recordUiUtils";
import isRRHVersionIndicatorEnabled from '@salesforce/accessCheck/Records.isRRHVersionIndicatorEnabled';
import { WindowUpdateEvent } from 'laf/windowUpdate';
import isRecordLayoutLcsCompilationEnabledGate from '@salesforce/gate/com.salesforce.records.isRecordLayoutLcsCompilationEnabled';
import FORM_FACTOR from '@salesforce/client/formFactor';
import NoRecordDataFound from '@salesforce/label/Errors.NoRecordDataFound';
import { convert15To18 } from "record_flexipage/recordContextHelper";
import myNewFeatureFlag from '@salesforce/featureFlag/Content.org.myNewFeatureGate';

/**
 * The Full Layout record detail panel implementation of the base record form.
 */
export default class LwcDetailPanel extends CapabilityMixin(LightningElement) {

    get isStringFeatureFlagEnabled() {
        return myNewFeatureFlag;
    }

    DYNAMIC_COMPONENT_TYPE = "DetailPanel";

    LAYOUT_TYPE = "Full";

    /** instance of the new metrics class */
    lwcDetailsReadsMarker = new ReadsMetrics("RecordHome.LWCDetailPanel");

    /** Return function for tracking the duration */
    markReadsDurationEnd;

    @api lwcDetails;

    /**
     * The mode (View/Edit/Create etc.) in which the panel needs to open
     */
    @api mode = "View";

    /**
     * The location from where the action was invoked
     */
    @api navigationLocation;

    /**
     * Decides the type of footer on the form, by default sticky
     */
    @api fixedFooter = false;
    /**
     * The id of the record to be displayed.
     */
    @api recordId;

    /**
     * The recordTypeId passed down from the actionWrapper.
     */
    _recordTypeId;

    /**
     * The API name of the object type being displayed.
     */
    @api objectApiName;

    /**
     * Width of the flexipage region
     */
    @api flexipageRegionWidth;

    /**
     * Variant for style purposes to be sent to baseRecordForm
     * @type {String}
     */
    @api variant = "card";

    /**
     * Load the record layout template here, and then provide it to the base detailPanel class.
     */
    @track recordLayoutTemplate;

    /**
     * Stores the error object from a failed attempt to load the record layout.
     */
    @track recordLayoutTemplateLoadState = {
        loaded: false,
        hasError: false,
        errorMessage: null
    };

    /**
     * flag to show header or not
     */
    @api showHeader;

    @track pageHeaderId;

    /**
     * Stores the detailPanel title
     */
    @track pageTitle;

    /**
     * Stores the defaultFieldValues for the detailPanel
     */
    @api defaultFieldValues;

    /**
     * Stores the draftFieldValues for the detailPanel.
     * Similar to defaultFieldValues, but also applies undoable dirty state.
     */
    @api draftFieldValues;

    /**
     * Stores the errors to be shown on the detail panel
     */
    @api errors;

    /**
     * Allows entity-specific title overrides. If present, sets the header and page title in Create, Edit, and Clone.
     */
    @api titleOverride;

    @api flexipageNotPresent = false;

    @track
    hasEditAccess = true;

    /**
     * Only used for the RRH version indicator. Set by an event fired from the recordLayout.
     * Can not be determined if the recordLayoutTemplate wire fails.
     */
    _isGeneratedWithElevatedPrivileges;

    /**
     * Whether the detail panel is shown in modal.
     */
    @api inModal = false;

    constructor() {
        super();
        this.recordLayoutDataLoaded = this._recordLayoutDataLoaded.bind(this);
        this.handleRecordLayoutLoadErrorEvent = this._handleRecordLayoutLoadErrorEvent.bind(this);
        this.handleNoAccessError = this._handleNoAccessError.bind(this);
        this.perfMarkIdentifierForFullRender = markTransactionStart("performance:lwc-detail-panel-from-constructorToFullRender", {});
    }

    /**
     * Returns if RRHVersionIndicatorEnabled check is true
     * Hide badge on mobile
     */
    get isRRHVersionIndicatorEnabled() {
        return isRRHVersionIndicatorEnabled && !this.isMobile;
    }

    get isRecordLayoutLcsCompilationEnabled() {
        return isRecordLayoutLcsCompilationEnabledGate.isOpen({ fallback: false });
    }

    get templateNamespace() {
        return 'forceGenerated';
    }

    get templateModuleName() {
        return `detailPanel_${this.objectApiName}___${this.recordTypeId}___${this.LAYOUT_TYPE}___${this.mode}`;
    }

    @api
    set recordTypeId(value) {
        this._recordTypeId = value;
    }

    get recordTypeId() {
        return this._recordTypeId;
    }

    async loadRecordTypeId() {
        if (this._recordTypeId) {
            this._recordTypeId = convert15To18(this._recordTypeId);
        } else if (this.recordId) {
            this._recordTypeId = await getRecordTypeId({recordId: this.recordId, objectApiName: this.objectApiName});
        }
    }

    /**
     * Load the full layout for record detail panel.
     */
    @wire(getRecordLayoutTemplate, { recordId: '$recordId', objectApiName: '$objectApiName', recordTypeId: '$recordTypeId', layoutType: 'Full', mode: '$mode', dynamicComponentType: 'DetailPanel' })
    onTemplate({ data, error }) {
        if (error) {
            this.recordLayoutTemplateLoadState.hasError = true;
            const reducedErrors = reduceUiApiWireErrors(error).join(", ");
            const errorMessage = error && error.message ? error.message : "";
            this.recordLayoutTemplateLoadState.errorMessage = reducedErrors && errorMessage && reducedErrors !== errorMessage
                ? `${reducedErrors} - ${errorMessage}`
                : reducedErrors;
            const payload = {
                errorStatus: error.status,
                errorText: error.statusText,
                errorBody: this.recordLayoutTemplateLoadState.errorMessage,
            };
            logError({ payload, source: 'records:lwcDetailPanel', mode: this.mode });
        } else if (data) {
            if (data.adg) {
                // Prefetch data dependencies identified within this template's Abstract Dependency Graph (ADG)
                // Doing so here allows optimal data resolution which boosts performance
                resolveAdg({ recordId: this.recordId, objectApiName: this.objectApiName, recordTypeId: this.recordTypeId, layoutType: 'Full', mode: this.mode, dynamicComponentType: 'DetailPanel' }, data.adg);
            }

            this.recordLayoutTemplateLoadState.hasError = false;
            this.recordLayoutTemplate = data.template;
        }

        if (data || error) {
            this.recordLayoutTemplateLoadState.loaded = true;
        }
    }

    refresh() {
        // TODO 242+ W-10308408 Remove RefreshCapability Implementation
        this[CapabilityMixin.GetRegisteredCapabilities](RefreshCapability)
            .forEach(registration => registration[RefreshCapability]());
    }

    connectedCallback() {
        const perfContext = {
            recordId: this.recordId,
            objectApiName: getInstrumentedObjectNameFromApiName(this.objectApiName),
            mode: this.mode
        };
        this.markReadsDurationEnd = this.lwcDetailsReadsMarker.trackValue();
        this.perfMarkIdentifierForRender = markTransactionStart("performance:lwc-detail-panel-from-connectedCallbackToFullRender", perfContext);
        // TODO 242+ W-10308408 Remove RefreshCapability Implementation
        this[CapabilityMixin.ExposeCapabilities]({ [RefreshCapability]: this.refresh.bind(this) });
        this[CapabilityMixin.EnableListener](RefreshCapability);
        this.template.addEventListener(RecordUiConstants.RECORD_LAYOUT_DATA_LOADED, this.recordLayoutDataLoaded);
        this.template.addEventListener(RecordUiConstants.RECORD_LAYOUT_NO_EDIT_ACCESS, this.handleNoAccessError);
        this.template.addEventListener(RecordUiConstants.RECORD_LAYOUT_LOADERROR, this.handleRecordLayoutLoadErrorEvent);

        if (this.isRecordLayoutLcsCompilationEnabled) {
            this.loadRecordTypeId();
        }
    }

    disconnectedCallback() {
        this[CapabilityMixin.ConcealCapabilities]();
        this.template.removeEventListener(RecordUiConstants.RECORD_LAYOUT_DATA_LOADED, this.recordLayoutDataLoaded);
        this.template.removeEventListener(RecordUiConstants.RECORD_LAYOUT_NO_EDIT_ACCESS, this.handleNoAccessError);
        this.template.removeEventListener(RecordUiConstants.RECORD_LAYOUT_LOADERROR, this.handleRecordLayoutLoadErrorEvent);
    }

    _recordLayoutDataLoaded(event) {
        if (this.mode !== RecordUiConstants.MODE_VIEW) {
            // eslint-disable-next-line @lwc/lwc/no-api-reassignments
            this.showHeader = true;
            this.setPageTitleContent(event.detail.pageTitleInfo);
            this.dispatchEvent(new WindowUpdateEvent(this.pageTitle));
        } else {
            // Measuring the duration to load lwcDetails with data
            const tags = {mode : this.mode};
            this.lwcDetailsReadsMarker.incrementCounter("lwcDetailsDataLoaded", false /* hasError */, tags);
            this.markReadsDurationEnd("lwcDetailsDataLoaded", false, tags);
        }

        // used for the RRH version indicator
        this._isGeneratedWithElevatedPrivileges = event?.detail?.isGeneratedWithElevatedPrivileges;
    }

    /**
     * Set the pageTitle for create/edit/clone.
     *
     * TODO W-8547915 - the pageHeaderdId is only conditionally set here which doesn't solve the accessibility issue that
     * it was intended to fix. The above bug is targeted for later this release which should resolve the aria-labelled-by ID
     * inconsistency issue. Leave the pageHeaderId as is until then.
     */
    setPageTitleContent(pageTitleInfo) {
        if (this.titleOverride) {
            this.pageTitle = this.titleOverride;
        } else if (pageTitleInfo) {
            // Use the localizedHeaderLabel if its sent from the geneartedComponent
            // localizedHeaderLabel will only be set for Create and Clone for Standard Entities
            if (pageTitleInfo.localizedHeaderLabel && pageTitleInfo.localizedHeaderLabel.length > 0) {
                this.pageTitle = pageTitleInfo.localizedHeaderLabel;
            } else {
                this.pageTitle = RecordUiHelpers.getPageTitle(this.mode, pageTitleInfo.recordDisplayName, pageTitleInfo.recordTypeName);
                this.pageHeaderId  = this.pageTitle.toLowerCase().replace(' ', '-');
            }
        }
    }

    handleBaseFormRenderCompleted() {
        if (this.perfMarkIdentifierForFullRender) {
            const perfContext = {
                recordId: this.recordId,
                objectApiName: getInstrumentedObjectNameFromApiName(this.objectApiName),
                mode: this.mode
            };
            markTransactionEnd(this.perfMarkIdentifierForFullRender.perfKey, perfContext);
        }
    }

    renderedCallback() {
        if (this.perfMarkIdentifierForRender) {
            markTransactionEnd(this.perfMarkIdentifierForRender.perfKey, this.perfMarkIdentifierForRender.perfContext);
        }
    }

    get shouldShowHeader() {
        return this.showHeader && this.hasEditAccess && !this.isMobile;
    }

    get isMobile() {
        return FORM_FACTOR === 'Small' || FORM_FACTOR === 'Medium';
    }

    _handleNoAccessError() {
        this.hasEditAccess = false;
    }

    /**
     * handles the data load error event
     */
    _handleRecordLayoutLoadErrorEvent(event) {
        const error = event.detail?.error;
        const shouldMarkError = !RecordErrorsLibrary.isHandledRecordLayoutLoadException(error?.errorCode) && error?.message !== NoRecordDataFound;

        // Increment the error counter and mark the duration
        const tags = {mode : this.mode};
        this.lwcDetailsReadsMarker.incrementCounter("lwcDetailsDataLoaded", shouldMarkError /* hasError */, tags);
        this.markReadsDurationEnd("lwcDetailsDataLoaded", RecordErrorsLibrary.onLoadErrorMsg(event), tags);

        // version indicator
        this._isGeneratedWithElevatedPrivileges = event?.detail?.isGeneratedWithElevatedPrivileges;
    }

    /**
     * Create from Lookup should hide 'Save and New' option
     */
    get hideSaveAndNewOption() {
        if (this.navigationLocation === RecordUiConstants.NAVIGATION_LOCATION.LOOKUP) {
            return true;
        }
        return false;
    }
}
