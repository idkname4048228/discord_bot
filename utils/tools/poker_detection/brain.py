def decide(cards):
    splits = split_cards(cards)
    for split in splits:
        decision = analyze(split[0], split[1])
        print(f"player: {split[0]}, dealer: {split[1]}, decision: {decision}")
    
def split_cards(cards):
    result = []
    
    for i in range(len(cards)):
        card = cards[i]
        remaining_cards = cards[:i] + cards[i+1:]
        result.append((remaining_cards, card))
    
    return result

def analyze(player_cards, dealer_card):
    values = {'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 10, 'Q': 10, 'K': 10}
    player_value = 0
    ace_count = 0
    isSoft = False
    
    for card in player_cards:
        player_value += values[card[0]]
        if card[0] == 'A':
            ace_count += 1

    if ace_count and player_value <= 11:
        player_value += 10
        isSoft = True

    dealer_value = values[dealer_card[0]]
    if dealer_card == 'A':
        dealer_value = 11
    
    if player_value >= 21:
        return "stand"
    
    if isSoft:
        return soft(player_value, dealer_value)
    else:
        return hard(player_value, dealer_value)
    
def soft(player_value, dealer_value):
    if player_value <= 17:
        return "hit"
    elif player_value >= 19:
        return "stand"
    else:
        if dealer_value <= 8:
            return "stand"
        else:
            return "hit"
    
    
    
def hard(player_value, dealer_value):
    if player_value <= 11:
        return "hit"
    elif player_value >= 17:
        return "stand"
    elif player_value == 12 and dealer_value <= 3:
        return "hit"
    elif dealer_value >= 7:
        return "hit"
    else:
        return "stand"
    
# cards = ['2H', '3H', '4H', '5H']
# decide(cards)