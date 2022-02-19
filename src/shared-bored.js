export default {
    preInputCalc(cptData, rlWaterTable) { 
        var depth, h, qc, qtn, n, qt, gtot, u0_kpa, sig_v0, sig_v0_prime, fs, fr_percent, lc;
         // todo: should do fancy input thing
        depth = []
        h = [] 
        qc = [];
        qt = [];
        gtot = [];
        u0_kpa = [];
        sig_v0 = [];
        sig_v0_prime = [];
        fs = [];
        fr_percent = [];
        n = [];
        lc = [];
        qtn = [];
        //iz1 = [];

        const parsed_cpt_data = JSON.parse(JSON.stringify(cptData))
        let vals = this.populateCPTDataValues(parsed_cpt_data, 0); //tipdepth (used in h) does not matter for pre-input calc.
        depth = vals.depth;
        h = vals.h;
        qc = vals.qc;
        gtot = vals.gtot;
        fs = vals.fs;
        
        for (let i=0; i<depth.length; i++) {
            qt.push(this.getQt(qc[i]));
            u0_kpa.push(this.getU0Kpa(depth[i], rlWaterTable))
            sig_v0.push(this.getSigV0(depth[i], gtot[i], rlWaterTable))
            sig_v0_prime.push(this.getSigV0Prime(sig_v0[i], u0_kpa[i]))
            fr_percent.push(this.getFrPercent(fs[i], qc[i], sig_v0[i]));
            let iterative_values = this.getIterativeValues(qt[i], sig_v0[i], sig_v0_prime[i], fr_percent[i])
            
            qtn.push(iterative_values.qtn);
            lc.push(iterative_values.lc);
            n.push(iterative_values.n)
        }

        let cpt_dict_temp = []
        for (let i=0; i<depth.length; i++) {
            cpt_dict_temp.push({
                index: i,
                depth: depth[i],
                h: h[i],
                fr_percent: fr_percent[i],
                qt: qt[i],
                gtot: gtot[i],
                u0_kpa: u0_kpa[i],
                sig_v0: sig_v0[i],
                sig_v0_prime: sig_v0_prime[i],
                lc: lc[i],
                qtn: qtn[i],
                n: n[i],
                //iz1: []
            })
        }
        return cpt_dict_temp; //returns CPT data.
        //this.createCPTCharts();
    },
    processInputParameters(tip, tipdepth, cptData, nominalSizeDoN, rlWaterTable, pileShape, borehole, dbase) {
        console.log(tip)
        console.log(tipdepth)
        console.log(cptData)
        console.log(nominalSizeDoN)
        console.log(rlWaterTable)
        console.log(pileShape)
        console.log(borehole)
        console.log(dbase)
        var depth, h, qc, qt, gtot, u0_kpa, sig_v0, sig_v0_prime, fs, fr_percent, lc, n, qtn;
        depth = []
        h = [] 
        qc = [];
        qt = [];
        gtot = [];
        u0_kpa = [];
        sig_v0 = [];
        sig_v0_prime = [];
        fs = [];
        fr_percent = [];
        n = [];
        lc = [];
        qtn = [];
        //bq = [];
        let tension_capacity = null;
        let compression_capacity = null; 

        const parsed_cpt_data = JSON.parse(JSON.stringify(cptData))
        let vals = this.populateCPTDataValues(parsed_cpt_data, tip); //tipdepth (used in h) does not matter for pre-input calc.
        depth = vals.depth;
        h = vals.h;
        qc = vals.qc;
        gtot = vals.gtot;
        fs = vals.fs;

        //const pilePerimeter = this.getPilePerimeter(pileShape, nominalSizeDoN)
        const pilePerimeter = this.getPilePerimeterBored(nominalSizeDoN)
  
        for (let i = 0; i < depth.length; i++) {
            qt.push(this.getQt(qc[i]));
            u0_kpa.push(this.getU0Kpa(depth[i], rlWaterTable))
            sig_v0.push(this.getSigV0(depth[i], gtot[i], rlWaterTable))
            sig_v0_prime.push(this.getSigV0Prime(sig_v0[i], u0_kpa[i]))
            fr_percent.push(this.getFrPercent(fs[i], qc[i], sig_v0[i]));
            let iterative_values = this.getIterativeValues(qt[i], sig_v0[i], sig_v0_prime[i], fr_percent[i])

            qtn.push(iterative_values.qtn);
            lc.push(iterative_values.lc);
            n.push(iterative_values.n);
            //bq.push(this.getBq(u0_kpa[i], qt[i], sig_v0[i])); 
            //kc.push(this.getKc(lc[i]));
            //qtc.push(this.getQtc(kc[i], qt[i]));
        }
        // base capacity calculation
        //let qp = [] // todo: check if this is qb?
        //let qb_sand = [];
        //let qb_clay = [];
        //let qp_clay = [];
        //let qb1_clay = [];
        //let qb1_sand = [];
        let lc_for_calcs = [];
        let qb1_adop = [];
        //let qp_sand = [];
        let qb_final = [];
        let coe_casing = [];
        //let delta_ord = []
        //let orc = [];
        //let tf_sand = [];
        //let tf_clay = [];
        let tf_adop_tension = [];
        let tf_adop_compression = [];
        let qs_tension = [];
        let qs_compression = [];
        let qt_tension = [];
        let qt_compression = [];

        //qp_clay = this.getQpClayArray(depth, qt, nominalSizeDoN, nominalSizeT);
        //qp_sand = this.getQpSandArray(depth, qtc, nominalSizeDoN);
        //alert('here1')
        //let diameter = this.getDiameter(nominalSizeDoN, nominalSizeT)
        //let ifr_value = this.getIFR(diameter)
        //let are_value = this.getAr(pileEndCondition, nominalSizeDoN, ifr_value, diameter);
        //let area_value = this.getArea(nominalSizeDoN);
        //let dstar_value = this.getDstar(pileEndCondition, nominalSizeDoN, diameter);
        //let area_value = this.getAreaB(pileShape, nominalSizeDoN);
        for (let i = 0; i < depth.length; i++) {
            //qp = this.getQpMixArray(qp_sand[i], qp_clay[i], lc[i]);
            
            //let ifr_value = 0.838 //todo: check if default value
            //let diameter = this.getDiameter(nominalSizeDoN, nominalSizeT)
            //let are_value = this.getAr(pileEndCondition, nominalSizeDoN, ifr_value, diameter);
            //alert(are_value)
            //let area_value = this.getArea(nominalSizeDoN);
            //let dstar_value = this.getDstar(pileEndCondition, nominalSizeDoN);
            //qb1_sand.push(this.getQb1Sand(are_value, qp_sand[i]) );
            //qb1_clay.push(this.getQb1Clay(qp_clay[i], dstar_value, nominalSizeDoN))
            //qb1_adop.push(this.getQb1Adop(lc[i], qb1_sand[i], qb1_clay[i]))

            //qb_sand.push(this.getQbSand(qp[i], are_value, area_value));
            //qb_clay.push(this.getQbClay(pileEndCondition, qt[i], area_value));
            //let area_b = this.getAreaB(pileShape, nominalSizeDoN);

            //qb_final.push(this.getQbFinal(qb1_adop[i], area_value));
            coe_casing.push(this.getCoeCasing(depth[i], tip, borehole));
            lc_for_calcs.push(lc[i])
            qb1_adop.push(this.getQb1AdopBored(lc_for_calcs[i], qt[i]));
            // todo: figure out area vs area B.
            if (coe_casing[i] == 0) {
                //delta_ord.push(0);
                //orc.push(0);
                //tf_sand.push(0);
                tf_adop_tension.push(0);
                tf_adop_compression.push(0);
                //} else { 
                //  if (lc[i]<2.5) { // advanced: allow users to modify this
                //delta_ord.push(this.getDeltaOrd(qtc[i], sig_v0_prime[i], nominalSizeDoN))
                //orc.push(this.getOrc(qtc[i], are_value, nominalSizeDoN, h[i]))
                //tf_sand.push(this.getTfSand(coe_casing[i], delta_ord[i], orc[i]));
                //   } else {
                //delta_ord.push(0);
                //orc.push(0);
                //tf_sand.push(0);
                //  }
                //}
                //tf_clay.push(this.getTfClay(qt[i], coe_casing[i], h[i], dstar_value));
                //iz1.push(this.getIz1(qtn[i], fr_percent[i]));
            }
           // alert('here2')
                if (coe_casing[i] != 0) {
                    //tf_adop_tension.push(this.getTfAdopTension(iz1[i], tf_clay[i], tf_sand[i], lc[i]));
                    //tf_adop_compression.push(this.getTfAdopCompression(iz1[i], tf_clay[i], tf_sand[i], lc[i]));

                    tf_adop_compression.push(this.getTfAdopCompressionBored(lc_for_calcs[i], qt[i]));
                    tf_adop_tension.push(this.getTfAdopTensionBored(lc_for_calcs[i], tf_adop_compression[i]));
                }
                let previousQsTension = i > 0 ? qs_tension[i - 1] : 0; // todo: check if tension or compression.
                let previousQsCompression = i > 0 ? qs_compression[i - 1] : 0; // todo: check if tension or compression.
                qs_tension.push(this.getQs(i, depth, tf_adop_tension[i], pilePerimeter, previousQsTension));
                qs_compression.push(this.getQs(i, depth, tf_adop_compression[i], pilePerimeter, previousQsCompression));
                qt_tension.push(this.getQtTension(qs_tension[i]));
                qt_compression.push(this.getQtCompression(qs_compression[i], qb_final[i]))
        }
        
        let area_b = this.getAreaBBored(dbase);

            // calculate total capacity
            let qt_res = [];
            let qb = [];
            for (let i = 0; i < depth.length; i++) {
                //qb.push(this.getQb(qb_sand[i], qb_clay[i], lc[i]));
                qb.push(this.getQbBored(coe_casing[i], qb1_adop[i], area_b))
                qt_res.push(this.getQtRes(qs_tension[i], qb[i]))
      

        } //todo: check if this is correct

            // calcuate final results - TODO: edit this based on new spreadsheet
            //let lookup_index = depth.indexOf(tip)
            //let lookup_result = qs_tension[lookup_index]; // check if tension or compression
            //compression_capacity = (lookup_result/1500).toFixed(3) //todo: don't use 1500, final numbers are qs, qb and qt.
            //lookup_index = depth.indexOf(tip)
            //lookup_result = qt_res[lookup_index];
            //tension_capacity = (lookup_result/1500).toFixed(3) 
            tension_capacity = this.getTensionCapacityLookup(depth, tip, qs_tension);
            compression_capacity = this.getCompressionCapacityLookup(depth, tip, qs_compression, qb);
            //create dictionaries
            var param_dict_temp = [];
            var res_dict_temp = [];
            for (let i = 0; i < depth.length; i++) {
                param_dict_temp.push({
                    index: i,
                    //ifr_value: ifr_value, //todo: check if default value
                    //diameter: diameter,
                    //are_value: are_value,
                    //area_value: area_value,
                    //dstar_value: dstar_value,
                    depth: depth[i],
                    h: h[i],
                    fr_percent: fr_percent[i],
                    qt: qt[i],
                    gtot: gtot[i],
                    u0_kpa: u0_kpa[i],
                    sig_v0: sig_v0[i],
                    sig_v0_prime: sig_v0_prime[i],
                    lc: lc[i],
                    qtn: qtn[i],
                    n: n[i],
                    //bq: bq[i],
                    //kc: kc[i],
                    //qtc: qtc[i]
                })


                res_dict_temp.push({
                    index: i,
                    depth: depth[i],
                    fr: fr_percent[i],
                    //delta_ord: delta_ord[i],
                    //orc: orc[i],
                    //tf_sand: tf_sand[i],
                    //tf_clay: tf_clay[i],
                    tf_adop_tension: tf_adop_tension[i],
                    tf_adop_compression: tf_adop_compression[i],
                    //iz1: iz1[i],
                    lc_for_calcs: lc_for_calcs[i],
                    qs_tension: qs_tension[i],
                    qs_compression: qs_compression[i],
                    qb: qb[i],
                    area_b: area_b
                    //qb1_clay: qb1_clay[i],
                    //qb1_sand: qb1_sand[i],
                    //qp_clay: qp_clay[i],
                    //qp_sand: qp_sand[i],
                })

            }
        
        
        // todo: remove - for debugging
        localStorage.param_dict = JSON.stringify(param_dict_temp);
        localStorage.res_dict = JSON.stringify(res_dict_temp);
        return {'tipdepth': tip, 'tension_capacity': tension_capacity, 'compression_capacity': compression_capacity};
    },
    //NEW
    getLcforCalcs(lc_value) {
        if (lc_value < 1.5) {
            return 1.5;
        } else if (lc_value > 4) {
            return 4;
        } else {
            return lc_value;
        }
    },
    getQb1AdopBored(lc_for_calcs, qt_value) {
        return 0.11*lc_for_calcs*qt_value;
    },
    getTfAdopCompressionBored(lc_for_calcs, qt_value) {
        return 0.008*101*Math.pow(lc_for_calcs, 1.6)*Math.pow((1000*qt_value/101), 0.8);
    },
    getTfAdopTensionBored(lc_for_calcs, compression) {
        if (lc_for_calcs < 2.05) {
            return 0.8*compression
        } else {
            return compression
        }
    },
    getQbBored(coe_casing, qb1_adop, ab_value) {
        if (coe_casing == 0) {
            return 0
        } else {
            return Math.abs(qb1_adop)*1000*ab_value
        }
    },
    getPilePerimeterBored(nominalSizeDoN) {
        return Math.PI*nominalSizeDoN
    },
    getAreaBBored(dbase) {
        return Math.PI*dbase*dbase*0.25
    },


    //OLD

    populateCPTDataValues(parsed_cpt_data, tipdepth)  {
        let depth = []
        let h = [] 
        let qc = [];
        let fs = [];
        let gtot = [];
        for (const row of parsed_cpt_data) {
        
            let depth_value = parseFloat(row[0]);
            depth.push(depth_value);
            
            h.push(tipdepth - depth_value); 
        
            let qc_value = parseFloat(row[1]); 
            qc.push(qc_value);
        
            let fs_value = parseFloat(row[2])
            fs.push(fs_value);
        
            // advanced: add U2

            let gtot_value = parseFloat(row[3]) 
            gtot.push(gtot_value);
        }

        return {
            depth: depth,
            h: h,
            qc: qc,
            fs: fs,
            gtot: gtot
        }
    },
    getQt(qc_value) {
        return qc_value; // advanced correct qt with u2
    },
    getU0Kpa(depth_value, rlWaterTable) {
        if (depth_value<rlWaterTable) { 
            return 0;
        } else {
            return (depth_value-rlWaterTable)*9.81 
        }
    },
    getSigV0(depth_value, gtot_value, rlWaterTable) {
        if (rlWaterTable < 0) {
            return depth_value*gtot_value+(Math.abs(rlWaterTable)*9.81); 
        } else {
            return depth_value*gtot_value;
        }
    },
    getSigV0Prime(sig_v0_value, u0_value) {
        return sig_v0_value - u0_value;
    },
    getFrPercent(fs_value, qc_value, sig_v0_value) {
        return fs_value/(qc_value*1000-sig_v0_value)*100
    },
    getDiameter(nominalSizeDoN, t_value) {
        return nominalSizeDoN-2*t_value/1000
    },
    getIterativeValues(qt_value, sig_v0_value, sig_v0_prime_value, fr_percent_value) {
        let ntrial = 0
        let n = 0
        let lc = 0
        let qtn = 0;
        if (fr_percent_value == 0) {
            lc = 0;
        } else {
            lc = this.getLc(qt_value, fr_percent_value) //todo: check this
        }
        ntrial = this.getN(lc, sig_v0_prime_value)
        let err = Math.abs(ntrial - n)
        let max = 100;
        let current = 0;
        while (err > 0.001) {
            qtn = this.getQtn(qt_value, sig_v0_value, sig_v0_prime_value, ntrial)
            if (fr_percent_value == 0) {
                lc = 0;
            } else {
                lc = this.getLc(qtn, fr_percent_value)
            }
            n =  Math.min(1, this.getN(lc, fr_percent_value))
            err = Math.abs(ntrial - n)
            ntrial = n
            current = current + 1;
            if (sig_v0_prime_value < 10 && current >= max) {
                break; //exit while loop
            }
        }
        return {
            qtn: qtn,
            lc: lc,
            n: n
        }

    },
    getLc(qtn_value, fr_percent_value) {
     return Math.pow((Math.pow((3.47-Math.log10(qtn_value)), 2) + Math.pow((Math.log10(fr_percent_value)+1.22), 2)), 0.5)
    },
    getN(lc_value, sig_v0_prime_value) {
      return 0.381*lc_value+0.05*(sig_v0_prime_value/100)-0.15;
    },
    getQtn(qt_value, sig_v0_value, sig_v0_prime_value, n_estimate) {
     return ((1000*qt_value-sig_v0_value)/100)*Math.pow((100/sig_v0_prime_value),n_estimate); //todo: check if qc or qt
    },
    getBq(u0_value, qt_value, sig_v0_value) {
        return ((-u0_value)/(qt_value*1000-sig_v0_value)) //advanced: correct this with u2
    },
    getAr(pileEndCondition, nominalSizeDoN, ifr_value, diameter) {
        if (pileEndCondition != 1) { //closed
        // return 1-0.980*(Math.pow(nominalSizeDoN-2*11.176/1000, 2))/(Math.pow(nominalSizeDoN, 2)); //TODO:figure out what 11.176 is and CALC 0.980
            return 1 - ifr_value*(Math.pow((diameter/nominalSizeDoN), 2))
        } else {
            return 1;
        }

    },
    getArea(nominalSizeDoN) {
        return Math.PI*nominalSizeDoN*nominalSizeDoN*0.25; 
    },
    getQbSand(qp_value, ar_value, area_value) {
        return qp_value*1000*(0.15+0.45*ar_value)*area_value;
    },
    getQbClay(pileEndCondition, qt_value, area_value) {
        if (pileEndCondition == 1) { //closed
          return (0.8*qt_value*1000)*area_value;
        } else {
          return (0.4*qt_value*1000)*area_value;
        }

    },
    getQb1Adop(lc_value, qb1_sand, qb1_clay) {
        if (lc_value > 2.5) { // if clay or zone, allow user to modify this 
            return qb1_clay
        } else {
            return qb1_sand
        }
    },
    getDstar(pileEndCondition, nominalSizeDoN, diameter) {
        if (pileEndCondition == 1) { //closed
            return nominalSizeDoN;
        } else {
            return Math.sqrt(Math.pow(nominalSizeDoN, 2)- Math.pow(diameter, 2));
        }
    },
    getCoeCasing(depth, tip, borehole) {
        if (depth < borehole)
            return 0
        else if (depth >= borehole && depth <= tip) {
            return 1
        } else {
            return 0
        }
    },

    getQbFinal(qb1_adop, area_b) {
        return qb1_adop*1000*area_b;
    },
    getTfAdopTension(iz1_value, tf_clay_value, tf_sand_value, lc_value) {
        if (iz1_value<0) { 
            return 0.5*tf_clay_value;
          } else {
            if(lc_value>2.5) { // advanced: allow user to modify this.
              return tf_clay_value;
            } else {
              return 0.75*tf_sand_value;
            }
          }
    },
    getTfAdopCompression(iz1_value, tf_clay_value, tf_sand_value, lc_value) {
        if (iz1_value<0) { 
            return 0.5*tf_clay_value;
          } else {
            if(lc_value>2.5) { // advanced: allow user to modify this.
              return tf_clay_value;
            } else {
              return tf_sand_value;
            }
          }
    },
    getAreaB(pileShape, nominalSizeDoN) {
        if (pileShape == 0) { //zero is circular
            return Math.PI*nominalSizeDoN*nominalSizeDoN*0.25
        }
        return nominalSizeDoN*nominalSizeDoN;
    },
    getQs(i, depth, tf_adop_value, pilePerimeter, previousQs) {
        let delta_z = 0;
        if (i == 0) {
          delta_z = depth[i]-0
          return tf_adop_value*pilePerimeter*(delta_z)+0 
        } else {
          delta_z = depth[i]-depth[i-1]
          return tf_adop_value*pilePerimeter*(delta_z)+previousQs
        }
    },
    getQb(qb_sand_value, qb_clay_value, lc_value) {
        if (lc_value < 2.05) { // advanced: allow user to modify this (this is when it is sand)
            return qb_sand_value;
        } else {
            return qb_clay_value;
        }
    },
    getQtRes(qs_value, qb_value) {
        return qs_value+qb_value
    },
    getPilePerimeter(pileShape, nominalSizeDoN) {
        if (pileShape == 0) { //zero is circular {
            return Math.PI*nominalSizeDoN;
        } else {
            return nominalSizeDoN*4
        }

    },
    getQtCompression(qs_compression, qb_final) {
        return qs_compression + qb_final;
    },
    getQtTension(qs_tension) {
        return qs_tension;
    },
    getTensionCapacityLookup(depthArray, tip, qs_tension) {
        let lookup_index = depthArray.indexOf(tip);
        let lookup_result = qs_tension[lookup_index];
        return lookup_result;
    },
    getCompressionCapacityLookup(depthArray, tip, qs_compression, qb_final) {
        let qs = 0;
        let lookup_index = depthArray.indexOf(tip);
        qs = qs_compression[lookup_index];
        let qb = 0;
        qb = qb_final[lookup_index];
        return qs + qb;
    },
    getIFR(diameter) {
        return Math.tanh(0.3*(Math.pow(diameter*1000/35.68, 0.5)))
    },
    log(base, number) {
        return Math.log(number) / Math.log(base);
    }
}


