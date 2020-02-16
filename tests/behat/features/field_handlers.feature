@api
Feature: FieldHandlers
  In order to prove field handling is working properly
  As a developer
  I need to use the step definitions of this context

  @d7 @d8
  Scenario: Test taxonomy term reference field handler
    Given "tags" terms:
      | name       |
      | Tag one    |
      | Tag two    |
      | Tag, three |
      | Tag four   |
    And "article" content:
      | title           | body             | promote | field_tags                    |
      # Field values containing commas should be escaped with double quotes.
      # The comma separator can optionally be followed by a space.
      | Article by Joe  | PLACEHOLDER BODY |       1 | Tag one, Tag two,"Tag, three" |
      | Article by Mike | PLACEHOLDER BODY |       1 | Tag four                      |
      | Article by Jane |                  |         |                               |
    And I am logged in as a user with the "administrator" role
    When I visit "admin/content"
    Then I should see the link "Article by Joe"
    And I should see the link "Article by Mike"
    And I should see the link "Article by Jane"
    When I am on the homepage
    Then I should see the link "Article by Joe"
    And I should see the link "Tag one"
    And I should see the link "Tag two"
    And I should see the link "Tag, three"
    And I should see the link "Article by Mike"
    And I should see the link "Tag four"
    And I should see the link "Article by Joe"
    And I should not see the link "Article by Jane"
