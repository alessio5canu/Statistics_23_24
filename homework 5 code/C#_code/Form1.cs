using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Forms.DataVisualization.Charting;
using System.Globalization;

namespace Hw3
{
    public partial class Form1 : Form
    {
        int nAttacks;
        int nSystems;
        Dictionary<int, (string, DataPointCollection)> attacksDict = new Dictionary<int, (string, DataPointCollection)>();


        public Form1()
        {
            InitializeComponent();
            WindowState = FormWindowState.Maximized;

            textBox1.Text = "10";
            textBox2.Text = "10";
            textBox3.Text = "0.6";

        }

        public static Random random = new Random();

        /*
        private void timer1_Tick(object sender, EventArgs e)
        {
            fillChart();
        }
        */


        //fillChart method
        private void fillChart()
        {

            // pulizia istogramma
            chart5.Series.Clear();
            // pulizia text box istogramma
            textBox4.Text = string.Empty;
            // rimozione di tutti gli elementi dal dizionario
            foreach (var key in attacksDict.Keys.ToList())
            {
                attacksDict.Remove(key);
            }

            int numberOfAttacks = int.Parse(textBox2.Text);
            nAttacks = numberOfAttacks;
            int numberOfSystems = int.Parse(textBox1.Text);
            nSystems = numberOfSystems;
            float probability;

            int indexNthAttack = 3;

            if (float.TryParse(textBox3.Text, NumberStyles.Float, CultureInfo.InvariantCulture, out probability))
            {
                Console.WriteLine("Conversione riuscita. Valore float: " + probability);
            }
            else
            {
                Console.WriteLine("Conversione non riuscita. L'input non è un valore float valido.");
            }

            //min value of probability
            float minValue = 0;
            //max value of probability
            float maxValue = 1;



            int[] x = generateX(numberOfAttacks);
            int[] y;
            //int[] yHistogram = new int[numberOfAttacks];
            double[] cumulatedFrequency;
            double[] relativeFrequency;
            double[] normalizedRatio;

            //int[] lastValues = new int[numberOfSystems];
            //int[] nthAttack = new int[numberOfSystems];

            chart1.Series.Clear();
            chart2.Series.Clear();
            chart3.Series.Clear();
            chart4.Series.Clear();

            (int[], double[], double[], double[]) result;



            for (int i = 0; i < numberOfSystems; i++)
            {

                result = generateCoordinateVector(numberOfAttacks, probability, minValue, maxValue);

                y = result.Item1;
                cumulatedFrequency = result.Item2;
                relativeFrequency = result.Item3;
                normalizedRatio = result.Item4;


                //lastValues.Append(y[y.Length - 1]);
                //nthAttack.Append(y[indexNthAttack]);

                var series = new Series($"Systems {i+1}");
                series.ChartType = SeriesChartType.Line;
                chart1.ChartAreas[0].AxisX.Minimum = 0;

                series.Points.DataBindXY(x, y);
                chart1.Series.Add(series);

                // memorizzazione attacchi
                if (!attacksDict.ContainsKey(i + 1))
                {
                    attacksDict[i + 1] = (series.Name, series.Points);
                }
                else
                {
                    Console.WriteLine("problem!");
                }

                var series2 = new Series($"Systems {i + 1}");
                series2.ChartType = SeriesChartType.Line;
                chart2.ChartAreas[0].AxisX.Minimum = 0;

                series2.Points.DataBindXY(x, cumulatedFrequency);
                chart2.Series.Add(series2);

                var series3 = new Series($"Systems {i + 1}");
                series3.ChartType = SeriesChartType.Line;
                chart3.ChartAreas[0].AxisX.Minimum = 0;

                series3.Points.DataBindXY(x, relativeFrequency);
                chart3.Series.Add(series3);

                var series4 = new Series($"Systems {i + 1}");
                series4.ChartType = SeriesChartType.Line;
                chart4.ChartAreas[0].AxisX.Minimum = 0;

                series4.Points.DataBindXY(x, normalizedRatio);
                chart4.Series.Add(series4);
            }
        }

        private void histogramCreation()
        {

            int chosenSys;
            if (int.TryParse(textBox4.Text, out chosenSys))
            {
                Console.WriteLine("valid chosen system");
            }
            else
            {
                Console.WriteLine("ERROR!!! invalid chosen system");
            }

            string chosenSysName;
            DataPointCollection chosenSysPoints;
            string lastSysName;
            DataPointCollection lastSysPoints;

            if (attacksDict.ContainsKey(chosenSys))
            {
                // vengono recuperati il nome del sistema scelto e i punti generati
                chosenSysName = attacksDict[chosenSys].Item1 as string;
                chosenSysPoints = attacksDict[chosenSys].Item2 as DataPointCollection;

                // vengono recuperati il nome e i punti generati dell'ultimo sistema
                lastSysName = attacksDict[nSystems-1].Item1 as string;
                lastSysPoints = attacksDict[nSystems-1].Item2 as DataPointCollection;

                // pulizia del grafico
                chart5.Series.Clear();
                //chart5.ChartAreas[0].AxisY.Maximum = nAttacks+1;

                // Creazione della serie per il primo set di dati
                Series series1 = new Series(chosenSysName);
                series1.ChartType = SeriesChartType.Bar;
                foreach (DataPoint point in chosenSysPoints)
                {
                    series1.Points.AddXY(point.XValue, point.YValues[0]);
                }

                chart5.Series.Add(series1);

                // Creazione della serie per il secondo set di dati
                Series series2 = new Series($"System {nSystems}"); // TODO: modifica stampa
                series2.ChartType = SeriesChartType.Bar;
                foreach (DataPoint point in lastSysPoints)
                {
                    series2.Points.AddXY(point.XValue, point.YValues[0]);
                }

                chart5.Series.Add(series2);

                // Aggiunta del grafico al form
                chart5.Dock = DockStyle.None;

                // Abilita l'auto-scalatura per l'asse X e Y
                chart5.ChartAreas[0].AxisX.Minimum = double.NaN;
                chart5.ChartAreas[0].AxisX.Maximum = double.NaN;
                chart5.ChartAreas[0].AxisY.Minimum = double.NaN;
                chart5.ChartAreas[0].AxisY.Maximum = double.NaN;
            }
            else
            {
                Console.WriteLine("key doesn't exist!");
            }
        }

        private void Form1_Load_1(object sender, EventArgs e)
        {
            fillChart();

        }

        public static int[] generateX(int size)
        {
            int[] x = new int[size];
            for (int i = 0; i < size; i++)
            {
                x[i] = i;
            }

            return x;
        }

        public static float GenerateRandomDouble(float minValue, float maxValue)
        {
            if (minValue > maxValue)
                throw new ArgumentException("minValue must be less than or equal to maxValue");

            float randomValue = (float)random.NextDouble(); // Generates a random double between 0 and 1
            float range = maxValue - minValue;
            float scaledValue = randomValue * range;
            float result = scaledValue + minValue;

            return result;
        }

        public static (int[], double[], double[], double[]) generateCoordinateVector(int size, float probability, float minValue, float maxValue)
        {
            int[] y = new int[size];
            double[] cumulatedFrequency = new double[size];
            double[] relativeFrequency = new double[size];
            double[] normalizedRatio = new double[size];
            y[0] = 0;
            int sum = 0;
            double sumFrequency = 0;
            float value = 0;


            for (int i = 1; i < size; i++)
            {
                value = GenerateRandomDouble(minValue, maxValue);

                sum += generateY(value, probability);
                sumFrequency += generateFrequencyY(value, probability);
                
                y[i] = sum;
                cumulatedFrequency[i] = sumFrequency;
                relativeFrequency[i] = sumFrequency/i+1;
                normalizedRatio[i] = sumFrequency / Math.Sqrt(i + 1);
            }

            return (y, cumulatedFrequency, relativeFrequency, normalizedRatio);
        }

        public static int generateY(float attack, float probability)
        {
            if (attack <= probability) return 0;
            else return +1;
        }

        public static int generateFrequencyY(float attack, float probability)
        {
            if (attack > probability) return 0;
            else return +1;
        }

        private void button1_Click(object sender, EventArgs e)
        {

            //timer1.Stop(); // Arresta il Timer se è in esecuzione
            //timer1.Start(); // Riavvia il Timer
            fillChart();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            histogramCreation();
        }
    }
}
