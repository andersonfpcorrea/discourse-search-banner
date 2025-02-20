import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";
import I18n from "discourse-i18n";

export default class SearchBanner extends Component {
  @service router;
  @service siteSettings;
  @service currentUser;

  get displayForRoute() {
    const showOn = settings.show_on;
    const currentRouteName = this.router.currentRouteName;

    if (showOn === "homepage") {
      return currentRouteName === `discovery.${defaultHomepage()}`;
    } else if (showOn === "top_menu") {
      return this.siteSettings.top_menu
        .split("|")
        .any((m) => `discovery.${m}` === currentRouteName);
    } else if (showOn === "discovery") {
      return currentRouteName.startsWith("discovery.");
    } else {
      // "all"
      return (
        currentRouteName !== "full-page-search" &&
        !currentRouteName.startsWith("admin.") && !currentRouteName.startsWith("docs.")
      );
    }
  }

  get displayForUser() {
    const showFor = settings.show_for;
    return (
      showFor === "everyone" ||
      (showFor === "logged_out" && !this.currentUser) ||
      (showFor === "logged_in" && this.currentUser)
    );
  }

  get buttonText() {
    return I18n.t(themePrefix("search_banner.search_button_text"));
  }

  get shouldDisplay() {
    return this.displayForRoute && this.displayForUser;
  }

  @action
  didInsert() {
    // Setting a class on <html> from a component is not great
    // but we need it for backwards compatibility
    document.documentElement.classList.add("display-search-banner");
  }

  @action
  willDestroy() {
    super.willDestroy(...arguments);
    document.documentElement.classList.remove("display-search-banner");
  }
}
