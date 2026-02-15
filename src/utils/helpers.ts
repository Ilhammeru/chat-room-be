export function generateTitleCase(word: string): string {
    let output: string = '';

    // Make capitalize in each letter
    let split = word.split(' ');
    for (let i = 0; i < split.length; i++) {
        // convert to lowercase first for all word
        split[i] = split[i].toLowerCase();

        split[i] = split[i][0].toUpperCase() + split[i].substring(1);
    }
    output = split.join(' ');

    return output;
}

export function countUniqueWordInString(word: string): Record<string, number> {
    let output: Record<string, number> = {};

    // Trim
    word = word.trim();

    // Remove multiple space
    word = word.replace(/\s+/g, ' ');

    let split = word.split(' ');
    for (let i = 0; i < split.length; i++) {
        // convert to lowercase world
        split[i] = split[i].toLowerCase();

        if (output[split[i]]) {
            output[split[i]] += 1;
        } else {
            output[split[i]] = 1;
        }
    }

    // Sort by value (asc)
    output = Object.fromEntries(
        Object.entries(output).sort(([, a], [, b]) => a - b)
    );

    return output;
}

export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function fetchData(url: string | null, callback?: (err: string | null, data: string | null) => void): Promise<string> | void {
    const promise = new Promise<string>((resolve, reject) => {
        setTimeout(() => {
            if (!url) {
                reject("URL is required");
            } else {
                resolve(`Data from ${url}`);
            }
        }, 1000);
    });

    if (callback) {
        promise
            .then(data => callback(null, data))
            .catch(err => callback(err, null));
        return;
    }

    return promise;
}

export function processData(data: string | null, callback?: (err: string | null, processedData: string | null) => void): Promise<string> | void {
    const promise = new Promise<string>((resolve, reject) => {
        setTimeout(() => {
            if (!data) {
                reject("Data is required");
            } else {
                resolve(data.toUpperCase());
            }
        }, 1000);
    });

    if (callback) {
        promise
            .then(processedData => callback(null, processedData))
            .catch(err => callback(err, null));
        return;
    }

    return promise;
}

