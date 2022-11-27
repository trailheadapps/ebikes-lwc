public class ActionDispatcher_GetInventory extends Slack.ShortcutDispatcher {
    public override Slack.ActionHandler invoke(
        Slack.ShortcutParameters parameters,
        Slack.RequestContext context
    ) {
        // The Slack action handler is instantiated and returned
        return Slack.ActionHandler.pushModal(new Handler(parameters, context));
    }

    public class Handler implements Slack.ModalHandler {
        Slack.ShortcutParameters parameters;
        Slack.RequestContext context;

        public Handler(
            Slack.ShortcutParameters parameters,
            Slack.RequestContext context
        ) {
            this.parameters = parameters;
            this.context = context;
        }

        // The class creates a modal view that is returned to the user
        public Slack.ModalView call() {
            // We then call a view reference
            Slack.ViewReference viewReference = Slack.View.get_inventory_modal.get();

            // We build the modal view and return it to the UI
            Slack.ModalView modalView = new Slack.ModalView.builder()
                .viewReference(viewReference)
                .build();
            return modalView;
        }
    }
}
