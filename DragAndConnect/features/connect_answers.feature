# features/draw_line.feature
Feature: Connect answers with line
  In order to learn portions of the brain that control certain activities
  As a student
  I want to connect an activity to a brain portion and receive feedback
  for being correct or incorrect

  Scenario: Billy correctly connected activities
    Given I am on slide 12
    When I connect all activities to answers "correctly"
    Then I should see "That's Correct! Good Job!"

  Scenario: Billy incorrectly connected activities
    Given I am on slide 12
    When I connect all activities to answers "incorrectly"
    Then I should see "Wrong. Try Again."
    And I should not see the notification after 2 seconds

  Scenario: Billy correctly connected activities
    Given I am on slide 42
    When I connect all activities to answers "correctly"
    Then I should see "That's Correct! Good Job!"

  Scenario: Billy incorrectly connected activities
    Given I am on slide 42
    When I connect all activities to answers "incorrectly"
    Then I should see "Wrong. Try Again."
    And I should not see the notification after 2 seconds
