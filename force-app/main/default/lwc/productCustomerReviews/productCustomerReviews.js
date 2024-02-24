import { LightningElement, wire, track, api } from 'lwc';
import getCustomerReviews from '@salesforce/apex/CustomerReviews.getCustomerReviews';
import { NavigationMixin } from 'lightning/navigation';

export default class CustomerReviews extends NavigationMixin(LightningElement) {
    @api recordId;
    @track reviews = [];

    @wire(getCustomerReviews, { recordId: '$recordId' })
    wiredReviews({ error, data }) {
        console.log('data:', data);
        console.log('error:', error);
        console.log(this.recordId);
        if (data) {
            this.reviews = data.map((review) => {
                let stars = [];
                for (let i = 0; i < review.Rating__c; i++) {
                    stars.push({ key: i, class: 'star_rating' }); // yellow stars for ratings
                }
                for (let i = review.Rating__c; i < 5; i++) {
                    stars.push({ key: i, class: '' }); // empty stars for the rest
                }
                return { ...review, stars, id: review.Id };
            });
        } else if (error) {
            console.error('Error:', error);
        }
    }

    handleOpenReview(event) {
        const reviewId = event.target.dataset.id;
        // Use NavigationMixin to navigate to the review detail page
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: reviewId,
                actionName: 'view'
            }
        });
    }
}
