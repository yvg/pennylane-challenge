Hey there Pennylane-team!

Thanks for taking your time to review this codebase.

[See the application live](https://pennylane-challenge.vercel.app/)

I'm not sure we will be chatting together so I wanted to clarify my thought process:

## Product aspects

Product-wise the application fulfills the requirements you stated in the README: creation, deletion and completion of invoices.

In addition to these 3 requirements I have also added rudimentary invoice lines functionality: Addition and deletion. There is currently one limitation: quantity does not impact the final price locally, the reason for this was that the existing data from the API does not seem consistent, and the API documents no way to provide it.

In the list page I have provided simple functionality to filter on periods of time, status, and customer. Due to API implementations it's partially done on BE and or FE and not-combinable.

## Technical aspects

From experience, there are two big risks with Invoicing applications:
 - The financial risk to users and their customers due to bugs.
 - The technical risk due to data sanity and hard to track bugs.

Bugs in such applications often manifest themselves due to poor state management, so I made it my priority to make it robust and flexible.
I have also added some level of validation; however it is far from complete, e.g. I don't programmatically check if the invoice deadline is not before the invoice date. These could be extra additions.

To achieve more predictable and easily testable state management, I moved it outside the React lifecycle as much as possible. Instead, you will find a layered-architecture with a mixture of standard design patterns you might be familiar with from backend or mobile applications:
 - A Repository pattern to do most of the CRUD operations outside React's context.
 - ViewModels, holding most of the logic (and tests).
 - Observable patterns (with RxJS) to expose the external state management to the React lifecycle.
 - Behaviour patterns to act as the glue between external storage, react states, event handlers, and components.
 - Dependency Injection to improve testability, particularly mocking.

In addition to these choices I have also made the choice to follow a modular architecture, where each folder in "screens" represents a module. One could also do things like micro front-ends, etc. but I think this goes beyond the needs of this exercice.

For the provided components ProductAutocomplete and CustomerAutocomplete, I have extended them as needed but did not change their inner workings, I hope this gives you an indication that I can work with most React apps, I am a pragmatic person :)

I have added limited testing to a few components, a few behaviours, ViewModels and the repositories. I did not seek 100%-coverage, I simply wanted to demonstrate my understanding of testing. Particularly contract testing.

Finally, I used env vars to inject the provided API token instead of hardcoding it in the source.

The architectural choices are a bit atypical for React apps, however I believe it provides the robustness and flexibility I was seeking, while leaving the reactive UI aspects to React.

### Further tech improvements

To avoid additional unecessary verbosity in this exercice I avoided adding other layers such as a Service pattern or Data Layer Mappings. In real-life these could be additional worthy concepts, depending on the needs.

#### Service pattern

The service pattern would allow to build more complex features, especially beyond Invoicing, hold their business logic, and communicate with necessary data sources.

For example: If we wanted to send invoices as emails, the ViewModel should not be aware of that logic or the data sources.

#### Data Layers

Repository patterns usually expose their own data types as domain models to represent the data in a way that is specific to the application, it allows the application to evolve as needed without making the underlying data source, in this case the API, a tightly-coupled dependency.

#### Localisation

I have not taken into account needs for localisation, there are no locale files, no language pickers, no currency pickers, etc.

Introducing it would be easy, however it would add even more scaffolding and verbosity to this exercice, so I decided against it.

### Product improvements

I had a few other personal commitments otherwise I would have liked to add:
 - Pagination, it would be as simple as retrieving the amount of pages, identifying which page we are on, and providing a way to the previous or next page. However due to limited filtering abilities of the BE, it would require a bit more work on the FE.
 - "Action Menus" in the invoices list so one could do more than just deleting from the list, such as: marking as paid, marking as finalized, etc.
 - Sorting and combinable filters, due to the mixture of BE & FE filtering, a bit more complex, ideally this would be taken care of by the backend to avoid the mixture of responsibilities between FE & BE.

And for a bit more visionary UX: I have worked on similar products before, from the top of my head there are many features customers have asked me for and are valuable with varying degrees, in no particular order:
 - Emailing invoices, could be achieved via third-parties like AWS SES and AmplifyJS.
 - Printing invoices, could be achieved via third-parties like jsPDF.
 - Automated payment reminders, would require backend work to setup frequently running jobs.
 - Custom VAT rates (esp. when launching internationally), requires extra FE work to allow such a feature & BE work for data storage.
 - Discounts (known as "escompte" in French), requires extra FE work to allow such a feature & BE work for data storage.
 - Industry-specific features, e.g. pre-populated product catalogues from wholesalers, requires partnerships with wholesalers, and BE integrations with their ecosystems.


 ---

 I hope I was able to demonstrates my technical knowledge and product thinking.
 Looking forward to hear from you!
