Feature: Test online calculator scenarios
Scenario Outline: Test addition
Given Open chrome browser and start application
When I enter following values and press = button
			|value1 | <value1>|
			|value2 | <value2>|
			|operator | <operator>|			
Then I should be able to see
			|	expected |<expected>|
Examples:
		| value1  		| value2 		| operator			| expected	 |
    	| 	999999999 	|   999999999	|		+			| 2e+9		 |
    	| 	-999999999 	|   -999999999	|		+			| -2e+9		 |
		| 	-0.25 		|   0.0000000   |		+			| -0.25		 |
        | 	1 		    |   2	        |		+			| 3	         |
        | 	-0.22 		|   -3.33333333	|		+			| -3.55333333|
        | 	1     		|   -2       	|		+			| -1	     |
        | 	-1     		|   2       	|		+			| 1	         |

Scenario Outline: Test subtraction
Given Open chrome browser and start application
When I enter following values and press = button
			|value1 | <value1>|
			|value2 | <value2>|
			|operator | <operator>|			
Then I should be able to see
			|	expected |<expected>|
Examples:
		| value1  		| value2 		| operator			| expected	|
    	| 	999999999 	|   -999999999	|		-			| 2e+9      |
    	| 	-999999999 	|   999999999	|		-			| -2e+9     |
		| 	-999999999 	|   0.0000000	|		-			| -999999999|
		| 	-0.75 		|   -0.25		|		-			| -0.5		|
		| 	0.75 		|   0.25		|		-			|  0.5		|

Scenario Outline: Test division
Given Open chrome browser and start application
When I enter following values and press = button
			|value1 | <value1>|
			|value2 | <value2>|
			|operator | <operator>|			
Then I should be able to see
			|	expected |<expected>|
Examples:
		| value1  		| value2 		| operator			| expected	 |
    	| 	0       	|   -999999999	|		/			| 0			 |
    	| 	999999999 	|   0.0000000   |		/			| Error		 |
		| 	999999999 	|   -0.00000001 |		/			| -8e+16	 |
		| 	-10 		|   1			|		/			| -10 	     |
		| 	0.6 		|   0.24		|		/			| 2.5 		 |
		| 	-10 		|   -3			|		/			| 3.33333333 |
	